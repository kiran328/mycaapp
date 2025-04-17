import PushNotification, { Importance } from 'react-native-push-notification';

class PushNotificationService {
    configure = () => {
        PushNotification.configure({
            onNotification: function (notification: any) {
                console.log('NOTIFICATION:', notification);
                // Handle incoming notifications here
            },
            onRegister: function (token: any) {
                console.log('TOKEN:', token);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });

        this.createChannel();
    };

    createChannel = () => {
        PushNotification.getChannels((channel_ids) => {
            console.log("Existing channels:", channel_ids);

            if (!channel_ids.includes('com.mycaapp')) {
                PushNotification.createChannel(
                    {
                        channelId: 'com.mycaapp',
                        channelName: "My App Notifications",
                        channelDescription: "A channel for reminders",
                        soundName: 'default',
                        importance: Importance.HIGH,
                        vibrate: true,
                    },
                    (created) => {
                        console.log(`createChannel returned '${created}'`);
                        if (!created) {
                            console.error('Failed to create the channel.');
                        }
                    }
                );
            } else {
                console.log('Channel already exists.');
            }
        });
    };


    showNotification = (title: string, message: string, imageUrl?: string, smallIcon?: string) => {
        PushNotification.localNotification({
            channelId: 'com.mycaapp',
            title: title,
            message: message,
            bigPictureUrl: imageUrl,
            smallIcon: 'ic_notification',
        });
    };
}

export const pushNotificationService = new PushNotificationService();
