export async function loadDemoFiles(): Promise<{
  billsFile: File;
  buildiumFile: File;
}> {
  try {
    // Fetch both demo files from the public directory
    // Note: In development, files are at root. In production with base path, 
    // Vite automatically handles the path resolution for public assets
    const [buildiumResponse, billsResponse] = await Promise.all([
      fetch('/duplicate-accounting-finder/Buildium-Export-Demo-File.csv'),
      fetch('/duplicate-accounting-finder/Bills-To-Enter-Demo-File.csv'),
    ]);

    if (!buildiumResponse.ok || !billsResponse.ok) {
      throw new Error('Failed to fetch demo files');
    }

    const [buildiumBlob, billsBlob] = await Promise.all([
      buildiumResponse.blob(),
      billsResponse.blob(),
    ]);

    const buildiumFile = new File(
      [buildiumBlob],
      'Buildium-Export-Demo-File.csv',
      { type: 'text/csv' }
    );
    const billsFile = new File(
      [billsBlob],
      'Bills-To-Enter-Demo-File.csv',
      { type: 'text/csv' }
    );

    return { billsFile, buildiumFile };
  } catch (error) {
    console.error('Error loading demo files:', error);
    throw new Error('Failed to load demo files. Please try again.');
  }
}
