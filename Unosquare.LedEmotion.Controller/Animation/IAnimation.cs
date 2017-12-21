namespace Unosquare.LedEmotion.Controller.Animation
{
    /// <summary>
    /// As imple interface to treat all animation types homogeneously
    /// </summary>
    public interface IAnimation
    {
        /// <summary>
        /// Paints the next frame of the animation instance.
        /// </summary>
        void PaintNextFrame();
    }
}
