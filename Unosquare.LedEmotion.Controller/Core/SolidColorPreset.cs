namespace Unosquare.LedEmotion.Controller.Core
{
    public class SolidColorPreset
    {
        public string Name { get; set; }
        public byte R { get; set; }
        public byte G { get; set; }
        public byte B { get; set; }

        public byte[] ToBytes() => new[] {R, G, B};

        public override string ToString() => $"{Name}: {R},{G},{B}";
    }
}