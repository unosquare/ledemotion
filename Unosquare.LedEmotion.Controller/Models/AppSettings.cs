namespace Unosquare.LedEmotion.Controller.Models
{
    using Unosquare.Swan.Attributes;

    class AppSettings
    {
        public int LedCount { get;  set; } = 240;
        
        public int FramesPerSecond { get;  set; } = 25;
        
        public int SpiChannel { get;  set; } = 1;

        public int SpiFrequency { get;  set; } = 1000000; // 1MHz is plenty for 240 LEDs at 24 FPS (4 bytes * 240 LEDs * 25 FPS = ~24kHz minimum)
    }
}
