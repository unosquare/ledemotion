namespace Unosquare.LedEmotion.Controller.Animation
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using Workers;
    using Unosquare.Swan.Formatters;

    public class ImageAnimation : IAnimation
    {
        private readonly object _syncLock = new object();
        private BitmapBuffer pixels = null;
        private int currentRow = 0;
        private int currentDirection = 1;
        
        public void SetImage(Bitmap imageColors)
        {
            lock (_syncLock)
            {
                currentRow = 0;
                pixels = new BitmapBuffer(imageColors);
            }
        }

        public void PaintNextFrame()
        {
            // TODO: Implement!
            lock (_syncLock)
            {
                // _currentAnimation.PaintNextFrame();
                // var targetColor = _colorSteps[_currentColorStep];
                // _currentAnimation.EnqueueColor(targetColor, TransitionTimePerPixel);
                // Bitmap arc = null;
                // BitmapBuffer pixels = arc;
                currentRow += currentDirection;
                if (currentRow >= pixels.ImageHeight)
                {
                    currentRow = pixels.ImageHeight - 2;
                    currentDirection = -1;
                }
                else if (currentRow <= 0)
                {
                    currentRow = 1;
                    currentDirection = 1;
                }

                LedStripWorker.Instance.LedStrip.SetPixels(pixels, 0, currentRow);
            }
        }
    }
}
