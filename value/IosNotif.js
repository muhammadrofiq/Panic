import PushNotification2 from 'react-native-push-notification';

    export default class NotificationService {
        //onNotificaitn is a function passed in that is to be called when a
        //notification is to be emitted.
      constructor(onNotification) {
        this.configure(onNotification);
        this.lastId = 0;
      }

      configure(onNotification) {
        PushNotification2.configure({
          onNotification: onNotification,

          // IOS ONLY (optional): default: all - Permissions to register.
          permissions: {
            alert: true,
            badge: true,
            sound: true
          },

          popInitialNotification: true,
        });
      }

        //Appears right away 
      localNotification() {
        this.lastId++;
        PushNotification2.localNotification({
          title: "Local Notification", 
          message: "My Notification Message", 
          playSound: false, 
          soundName: 'default', 
          actions: '["Yes", "No"]'
        });
      }

        //Appears after a specified time. App does not have to be open.
      scheduleNotification() {
        this.lastId++;
        PushNotification2.localNotificationSchedule({
          date: new Date(Date.now() + (30 * 1000)), //30 seconds
          title: "Scheduled Notification", 
          message: "My Notification Message",
          playSound: true, 
          soundName: 'default', 
        });
      }

      checkPermission(cbk) {
        return PushNotification2.checkPermissions(cbk);
      }

      cancelNotif() {
        PushNotification2.cancelLocalNotifications({id: ''+this.lastId});
      }

      cancelAll() {
        PushNotification2.cancelAllLocalNotifications();
      }
    }