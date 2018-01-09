namespace Unosquare.LedEmotion.Controller.Workers
{
    using System.Diagnostics;
    using System.IO;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using Labs.EmbedIO;
    using Labs.EmbedIO.Modules;
    using Core;
    using Swan.Abstractions;
    using System;
    using Unosquare.Swan;

    public class WebServerWorker : SingletonBase<WebServerWorker>, IWorker
    {
        public const string StaticFilesFolderName = "wwwroot";
        private const string DefaultUrl = "http://localhost:9696/";
        
        private static readonly object SyncLock = new object();
        private CancellationTokenSource _tokenSource;
        private Task _webServerTask;

        /// <summary>
        /// Prevents a default instance of the <see cref="WebServerWorker"/> class from being created.
        /// </summary>
        private WebServerWorker()
            : base()
        {
            // placeholder
        }

        public string StaticFilesRootPath => Path.Combine(Runtime.EntryAssemblyDirectory, StaticFilesFolderName);
        
        public WebServer Server { get; private set; }

        public void Start()
        {
            lock (SyncLock)
            {
                if (Server != null) return;

                Server = new WebServer(Debugger.IsAttached ? DefaultUrl : "http://+:9696");
                Server.RegisterModule(new LocalSessionModule());
                Server.RegisterModule(new StaticFilesModule(StaticFilesRootPath));
                Server.Module<StaticFilesModule>().UseRamCache = false;
                Server.RegisterModule(new WebApiModule());
                Server.Module<WebApiModule>().RegisterController<Api>();

                _tokenSource = new CancellationTokenSource();
                _webServerTask = Server.RunAsync(_tokenSource.Token);
            }
        }

        public void Stop()
        {
            lock (SyncLock)
            {
                if (Server == null) return;

                _tokenSource.Cancel(false);
                Server.Dispose();
                _webServerTask = null;
                Server = null;
            }
        }
    }
}