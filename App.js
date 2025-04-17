import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

const BlobExample = () => {
  const [loading, setLoading] = useState(false);
  const [downloadPath, setDownloadPath] = useState(null);
  const [error, setError] = useState(null);

  // Example PDF URL
  const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  
  const downloadFile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get directory path for downloads
      const dirs = RNFetchBlob.fs.dirs;
      const filePath = `${dirs.DownloadDir}/test-file-${Date.now()}.pdf`;
      
      // Download the file
      const res = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'File download using react-native-blob-util',
        },
      }).fetch('GET', samplePdfUrl);
      
      console.log('File downloaded to:', res.path());
      setDownloadPath(res.path());
      setLoading(false);
    } catch (err) {
      console.error('Download failed:', err);
      setError(`Download failed: ${err.message}`);
      setLoading(false);
    }
  };

  const checkFileSystem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // List files in the documents directory
      const dirs = RNFetchBlob.fs.dirs;
      const files = await RNFetchBlob.fs.ls(dirs.DocumentDir);
      console.log('Files in document directory:', files);
      
      // Create a test file
      const testFilePath = `${dirs.DocumentDir}/test-file-${Date.now()}.txt`;
      await RNFetchBlob.fs.writeFile(testFilePath, 'This is a test file created with react-native-blob-util', 'utf8');
      
      // Read the file back
      const content = await RNFetchBlob.fs.readFile(testFilePath, 'utf8');
      console.log('File content:', content);
      
      setDownloadPath(testFilePath);
      setLoading(false);
    } catch (err) {
      console.error('File system operation failed:', err);
      setError(`File system operation failed: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>react-native-blob-util Example</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={downloadFile}>
          <Text style={styles.buttonText}>Download Sample PDF</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={checkFileSystem}>
          <Text style={styles.buttonText}>Test File System Operations</Text>
        </TouchableOpacity>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {downloadPath && !loading && !error && (
        <View style={styles.resultContainer}>
          <Text style={styles.successText}>Operation Successful!</Text>
          <Text style={styles.pathText}>Path: {downloadPath}</Text>
        </View>
      )}

      <Text style={styles.note}>
        Note: Check your console logs for more details about the operations.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  pathText: {
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
  },
  note: {
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default BlobExample;