# HamSync 📱

HamSync is a comprehensive mobile application designed to streamline student life and foster campus community. Built with React Native and Expo, it combines academic utilities with social features to help students stay organized, connected, and informed.

## 🚀 Features

### 🎓 Academic Tools
- **Merit Calculator**: Calculate your aggregate and chances of admission for various universities.
- **UniGuide**: Comprehensive guide to universities, programs, and admission criteria.
- **SyncLibrary**: A digital library resource for sharing and accessing study materials.

### 💬 Social & Community
- **Real-time Chat**: Messaging system to connect with peers.
- **Community Feed**: Share posts, updates, and announcements.
- **Student Profiles**: Customizable profiles to showcase academic standing and interests.

### 🔐 Authentication & Security
- Secure Login & Registration.
- User Onboarding Flow.
- Profile Setup & Management.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Backend/Services**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- **Icons**: Expo Vector Icons

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or newer recommend)
- npm or yarn
- Expo Go app on your physical device (Android/iOS) OR Android Studio / Xcode for emulation.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Hammad-111/HamSync.git
    cd HamSync
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    - The app uses Firebase. Ensure you have your `src/services/firebaseConfig.ts` set up with your Firebase credentials.
    - If you are setting up a fresh instance, create a project in the [Firebase Console](https://console.firebase.google.com/), enable Authentication, Firestore, and Storage, and copy the config details to the config file.

4.  **Run the application**
    ```bash
    npx expo start
    ```
    - Scan the QR code with your phone (using Expo Go) or press `a` for Android Emulator / `i` for iOS Simulator.

## 📁 Project Structure

```
HamSync/
├── assets/             # Images, fonts, and static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context definitions (e.g., Toast)
│   ├── navigation/     # Stack and Tab navigators
│   ├── screens/        # Application screens
│   ├── services/       # API and backend service logic (Firebase, etc.)
│   ├── types/          # TypeScript type definitions
│   └── global.css      # Tailwind directives
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
