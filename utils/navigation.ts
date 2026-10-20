import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';

type LocationLike = {
  pathname: string;
  search: string;
  hash: string;
};

export function navigateBack(
  navigate: NavigateFunction,
  location: LocationLike,
  fallback: string
) {
  const historyIndex = window.history.state?.idx;

  if (typeof historyIndex === 'number' && historyIndex > 0) {
    navigate(-1);
    return;
  }

  navigate(fallback, { replace: true });
}

export function useHistoryLayer(stateKey: string) {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState =
    location.state && typeof location.state === 'object' && !Array.isArray(location.state)
      ? (location.state as Record<string, unknown>)
      : {};
  const isOpen = locationState[stateKey] === true;

  const open = useCallback(() => {
    if (isOpen) return;
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      state: { ...locationState, [stateKey]: true },
    });
  }, [isOpen, location.hash, location.pathname, location.search, locationState, navigate, stateKey]);

  const close = useCallback(() => {
    if (isOpen) navigate(-1);
  }, [isOpen, navigate]);

  return { isOpen, open, close };
}
