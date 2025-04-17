import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from './WebView';

interface RouteParams {
    url: string;
    appBarTitle: string;
    showAppBar?: boolean;
}

interface Props {
    navigation?: any;
    route?: {
        params: RouteParams;
    };
    uri?: string;
}

const WView: React.FC<Props> = ({ navigation, route, uri }) => {
    const [showAppBar, setShowAppBar] = useState(false);
    const [appBarTitle, setAppBarTitle] = useState('');
    const [WebURI, setWebURI] = useState('');
    const [reloading, setReloading] = useState(false);
    const webviewRef = useRef<any>(null);

    useEffect(() => {
        const setURL = () => {
            if (uri) {
                setWebURI(uri);
            } else if (route?.params) {
                const { url, showAppBar, appBarTitle } = route.params;
                setShowAppBar(!!showAppBar);
                setAppBarTitle(appBarTitle);
                setWebURI(url);
            }
        };

        const navListener = navigation?.addListener('focus', setURL);

        return () => {
            if (navListener) navListener();
        };
    }, [navigation, route, uri]);

    useEffect(() => {
        if (reloading) {
            setReloading(false);
        }
    }, [reloading]);

    const renderLoadingSpinner = () => {
        return (
            <View style={{ marginBottom: Dimensions.get('window').height / 2 }}>
                <Text>Loading...</Text>
            </View>
        );
    };

    const handleLoadEnd = () => {
        console.log('Loaded complete', webviewRef.current);
        /* Uncomment to enable reloading logic
        if (
          webviewRef.current?.startUrl == null ||
          webviewRef.current?.startUrl == 'about:blank'
        ) {
          console.log('%c Reloading...', 'color: red');
          webviewRef.current?.clearCache();
          webviewRef.current?.clearHistory();
          webviewRef.current?.clearFormData();
          webviewRef.current?.reload();
          setReloading(true);
        }
        */
    };

    return (
        <View style={styles.container}>
            {!reloading && WebURI ? (
                <WebView
                    ref={webviewRef}
                    style={{ width: Dimensions.get('window').width }}
                    source={{ uri: WebURI.trim() }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={renderLoadingSpinner}
                    onLoadEnd={handleLoadEnd}
                    useWebKit={true}
                    renderError={(error) => (
                        <View style={{ flex: 1 }}>
                            <Text>{error}</Text>
                        </View>
                    )}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                />
            ) : (
                <View style={styles.error}>
                    <Text style={styles.errorText}>Invalid URL supplied</Text>
                </View>
            )}
        </View>
    );
};

export default WView;
