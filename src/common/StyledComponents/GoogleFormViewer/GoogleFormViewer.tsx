import React from 'react';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

interface GoogleFormViewerProps {
    formUrl: string;
}

const GoogleFormViewer: React.FC<GoogleFormViewerProps> = ({ formUrl }) => {
    return (
        <View style={{ flex: 1 }}>
            <WebView
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                source={{ uri: formUrl }}
                scrollEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator size="large" color="blue" />
                )}
            />
        </View>
    );
};

export default GoogleFormViewer;
