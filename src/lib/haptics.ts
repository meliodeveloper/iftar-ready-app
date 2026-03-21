const vibrate = (pattern: number) => {
  if (navigator.vibrate) navigator.vibrate(pattern);
};

export const haptics = {
  light: () => vibrate(10),
  medium: () => vibrate(25),
  heavy: () => vibrate(50),
};
