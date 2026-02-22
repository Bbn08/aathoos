using System.IO;

namespace aathoos.Core;

/// <summary>
/// Application-wide database singleton.
/// Opens (or creates) the SQLite file at
/// %LOCALAPPDATA%\aathoos\aathoos.db on first access.
/// </summary>
public sealed class AppDatabase
{
    private static AppDatabase? _instance;
    public static AppDatabase Instance => _instance ??= new AppDatabase();

    public CoreBridge Bridge { get; }

    private AppDatabase()
    {
        var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var dir = Path.Combine(localAppData, "aathoos");
        Directory.CreateDirectory(dir);

        var dbPath = Path.Combine(dir, "aathoos.db");
        var handle = CoreInterop.aathoos_db_open(dbPath);
        if (handle == IntPtr.Zero)
            throw new InvalidOperationException($"Failed to open database at {dbPath}");

        Bridge = new CoreBridge(handle);
    }
}
