# Firebase Overview

{{crumb:Introduction}}
## Introduction

Firebase is a platform developed by Google for creating mobile and web applications. It was originally an independent company founded in 2011. In 2014, Google acquired the platform, and it is now their flagship offering for app development.

## Table of Contents
- [Introduction](#introduction)
- [Firebase Products](#firebase-products)
  - [Authentication](#authentication)
  - [Firestore](#firestore)
  - [Realtime Database](#realtime-database)
  - [Storage](#storage)
  - [Hosting](#hosting)
  - [Functions](#functions)
  - [Machine Learning](#machine-learning)
- [Getting Started](#getting-started)
  - [Setting Up Firebase](#setting-up-firebase)
  - [Creating a Firebase Project](#creating-a-firebase-project)
- [Firebase Authentication](#firebase-authentication)
- [Firestore](#firestore)
  - [Data Model](#data-model)
  - [Queries](#queries)
  - [Security Rules](#security-rules)
- [Realtime Database](#realtime-database)
  - [Data Model](#realtime-database-data-model)
  - [Security Rules](#realtime-database-security-rules)
- [Firebase Storage](#firebase-storage)
- [Firebase Hosting](#firebase-hosting)
- [Firebase Functions](#firebase-functions)
- [Firebase Machine Learning](#firebase-machine-learning)
- [Conclusion](#conclusion)

{{crumb:Firebase Products}}
## Firebase Products

### Authentication

{{crumb:Authentication}}
Firebase Authentication provides backend services, easy-to-use SDKs, and ready-made UI libraries to authenticate users to your app. It supports authentication using passwords, phone numbers, popular federated identity providers like Google, Facebook, and Twitter, and more.

### Firestore

{{crumb:Firestore}}
Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform. Firestore is a NoSQL database that allows for real-time data synchronization and offers offline support.

### Realtime Database

{{crumb:Realtime Database}}
The Firebase Realtime Database is a cloud-hosted database. Data is stored as JSON and synchronized in real-time to every connected client.

### Storage

{{crumb:Storage}}
Firebase Storage provides secure file uploads and downloads for Firebase apps, regardless of network quality. You can use it to store images, audio, video, or other user-generated content.

### Hosting

{{crumb:Hosting}}
Firebase Hosting provides fast and secure static hosting for your web app. It offers a global CDN, SSL by default, and custom domain support.

### Functions

{{crumb:Functions}}
Firebase Functions lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests.

### Machine Learning

{{crumb:Machine Learning}}
Firebase Machine Learning is a mobile SDK that brings Google's machine learning expertise to Android and iOS apps in a powerful yet easy-to-use package.

## Getting Started

{{crumb:Getting Started}}
### Setting Up Firebase

To start using Firebase, you need to set up a Firebase project and register your app with Firebase.

### Creating a Firebase Project

{{crumb:Creating a Firebase Project}}
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click "Add project" and follow the on-screen instructions.
3. Register your app by selecting the platform (iOS, Android, or web).

## Firebase Authentication

{{crumb:Firebase Authentication}}
Firebase Authentication provides several methods to authenticate users. You can use email and password authentication, phone authentication, and federated identity providers like Google and Facebook.

## Firestore

{{crumb:Firestore}}
### Data Model

Firestore is a NoSQL database that stores data in documents, which are organized into collections. Each document contains a set of key-value pairs.

### Queries

{{crumb:Queries}}
Firestore supports a rich query language, allowing you to perform complex queries on your data.

### Security Rules

{{crumb:Security Rules}}
Firestore security rules allow you to control access to your data based on user authentication and data conditions.

## Realtime Database

{{crumb:Realtime Database}}
### Data Model

The Firebase Realtime Database stores data as a large JSON tree. This structure is ideal for real-time synchronization but can become unwieldy for complex queries.

### Security Rules

{{crumb:Realtime Database Security Rules}}
Realtime Database security rules allow you to define who has read and write access to your data.

## Firebase Storage

{{crumb:Firebase Storage}}
Firebase Storage allows you to store and serve user-generated content, such as photos and videos. It integrates seamlessly with Firebase Authentication to identify users, and it provides robust security via Firebase Security Rules.

## Firebase Hosting

{{crumb:Firebase Hosting}}
Firebase Hosting offers a fast and secure way to deploy web apps. With just one command, you can quickly deploy web apps and serve both static and dynamic content to a global CDN (Content Delivery Network).

## Firebase Functions

{{crumb:Firebase Functions}}
Firebase Functions enable you to extend the functionality of your app by running backend code in response to events triggered by Firebase features and HTTPS requests.

## Firebase Machine Learning

{{crumb:Firebase Machine Learning}}
Firebase Machine Learning provides on-device and cloud-based APIs for common use cases such as image labeling, face detection, and text recognition.

{{crumb:Conclusion}}
## Conclusion

Firebase offers a comprehensive suite of tools and services for building high-quality apps. From authentication to real-time databases, secure file storage, and machine learning, Firebase provides everything you need to develop robust and scalable applications.

