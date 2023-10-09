export class Video {
  public static getHTMLVideoElement = (): HTMLVideoElement | null => {
    const video = document.querySelector('video');
    return video ? video : null;
  };

  public static pause = (): void => {
    const video = Video.getHTMLVideoElement();
    if (video) {
      video.pause();
    }
  };

  public static play = (): void => {
    const video = Video.getHTMLVideoElement();
    if (video) {
      video.play();
    }
  };
}
