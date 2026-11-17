import threading
import time
from collections import deque
from typing import Deque, Dict

from fastapi import HTTPException, Request

from core.config import settings


class SlidingWindowLimiter:
    """Per-IP sliding window plus a global sliding window. In-memory, single process."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._per_ip: Dict[str, Deque[float]] = {}
        self._global: Deque[float] = deque()

    @staticmethod
    def _prune(queue: Deque[float], window: float, now: float) -> None:
        while queue and now - queue[0] >= window:
            queue.popleft()

    def check(self, ip: str) -> None:
        now = time.monotonic()
        ip_window = settings.RATE_LIMIT_PER_IP_WINDOW_SECONDS
        global_window = settings.RATE_LIMIT_GLOBAL_WINDOW_SECONDS

        with self._lock:
            self._prune(self._global, global_window, now)
            if len(self._global) >= settings.RATE_LIMIT_GLOBAL_MAX:
                retry_after = int(global_window - (now - self._global[0])) + 1
                raise HTTPException(
                    status_code=503,
                    detail="The story generator has reached its daily limit. Please try again later.",
                    headers={"Retry-After": str(retry_after)},
                )

            queue = self._per_ip.setdefault(ip, deque())
            self._prune(queue, ip_window, now)
            if len(queue) >= settings.RATE_LIMIT_PER_IP_MAX:
                retry_after = int(ip_window - (now - queue[0])) + 1
                minutes = max(1, retry_after // 60)
                raise HTTPException(
                    status_code=429,
                    detail=f"Too many stories requested. Try again in about {minutes} minute(s).",
                    headers={"Retry-After": str(retry_after)},
                )

            queue.append(now)
            self._global.append(now)

            # Keep memory bounded: drop IPs whose window has fully expired.
            if len(self._per_ip) > 10000:
                for key in list(self._per_ip):
                    self._prune(self._per_ip[key], ip_window, now)
                    if not self._per_ip[key]:
                        del self._per_ip[key]


_limiter = SlidingWindowLimiter()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def limit_story_creation(request: Request) -> None:
    """FastAPI dependency. Raises 429 (per-IP) or 503 (global cap) before any Gemini call happens."""
    _limiter.check(_client_ip(request))