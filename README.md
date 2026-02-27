# Subscription Manager

This application is meant to help with monthly subscriptions, so that one doesn't get lost in their subcription finances. A user will be able to see a list view of all their subscriptions and have the ability to delete a subscription or add one. When adding a subscription, a user will be prompted to input the frequency, fixed billing amount, billing period, next charge date, category, and notes. The user will also be able to view a spending summary across all subscriptions, with a recurring billing simulation. This application will also include free trial tracking, where a user can input a free trial that they signed up for, and will notify the user a couple days before the firee trial expires.


## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Don't you just love having the ability to have numerous streams of media all at the access of your hands through subscriptions, however may feel the overbearing weight of not knowing how much it is all costs? Or wonder if you are still paying for a subscription that you stopped using months or years ago? The Subscription Tracker appliaction makes it vary easy to track your subscription expenses and organize them all into one place. Allowing you to centralize subscription tracking, calculate true monthly costs, while also sending reminders for trials and renewals. This easily converts a blind spot in finances to a simple instrument board.

### Design

![Design image](/images/IMG_8AA04D325282-1.jpeg)


### Key features

- Login using HTTPS
- Ability to edit, add to, or remove from the subscription dashboard
- Display the dashboard
- Calculate teh monthly expenses
- Notifications about what subscriptions are upcoming
- Abiity to input a free trial
- Ability to sort by category

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - This will help give structure. 5 pages of html: the dashboard, editing the dashboard, adding a subscription, deleting a subscription, editing a subscription
- **CSS** - Used in the overall look of the interface. Different uses of color and whitespace, to make the application look appealing. It will also be used in sizing the diffrent interactive features of the application.
- **React** - Used to allow the user to input edits, login, choose an edit, add a subscription and its corresponding information, delete a subscription, navigate back to the dashboard, and make edits to a subscription.
- **Service** - Included endpoints are: login, the dashboard, choosing an edit, retrieving information for a new subscription, deleting a subscription, and editing a subscription
- **DB/Login** - Stores the user with subscriptions and its corresponding information. Registers the user and saves the data in the database.
- **WebSocket** - The data will be displayed back to the user in the dashboard with its corresponding elements, and included in the calculation for monthly expenses.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://subscriptionmanager.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - My HTML pages are Home, Dashboard, Edit Dashboard, Add Subscription, Delete Subscription, Edit Subscription, and About. 
- [x] **Proper HTML element usage** - My program uses nav, buttons, form, text inputs, etc.
- [x] **Links** - Links are used to navigate to different pages.
- [x] **Text** - The text has proper application context, with titles, headings, text inputs, paragraphs, etc.
- [x] **3rd party API placeholder** - I will use 3rd party API for email notifications. My dashboard page has an "Enable Notifications" button.
- [x] **Images** - Image usage found on about page.
- [x] **Login placeholder** - Login placeholder is found on the home page.
- [x] **DB data placeholder** - DB placehholder is found on the dashboard page and "add subscription" page.
- [x] **WebSocket placeholder** - Websocket will be used with sharing your personal dashboard, as seen in the dashboard page so others can see real time updates.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Visually appealing colors and layout. No overflowing elements.** - I created a color pallette that I liked and used that across my entire site. I also made a consistent page structure that was used across all pages, including a sticky header, a central content container, and a footer anchored to the bottom of the page. I also used flexbox and grid displays, along with the use of cards to organize sections and information on my page. I wanted it to look even nicer with shading and transparency throughout the page(I had to use some internet help for that).
- [x] **Use of a CSS framework** - I used bootstrap as a foundation and built off of it. I also used it to help me make a drop down menu in my header for the "edit dashboard" button.
- [x] **All visual elements styled using CSS** - This is very evident in my main.css, dashboard.css, and forms.css.
- [x] **Responsive to window resizing using flexbox and/or grid display** - I used grid to organize forms and dashboard content into evenly spaced columns. I used flexbox to align navigation items, buttons, and content blocks. Consistent padding, margins, and spacing between elements helped prevent clutter and improve readability.
- [x] **Use of a imported font** - I imported and used the font "Source Sans 3". The imports are visible in my html files and the usage is visible in my main.css in the element selector "body".
- [x] **Use of different types of selectors including element, class, ID, and pseudo selectors** -  I used element selectors to style base HTML structure(body, main, label, heading selectors). I used class selectors a lot. Majority of my styling was done with class selectors and this is very evident in my css files. I implemented and ID selector for my about-blah section on the About page(line 250 in main.css). I also used pseudo-classes(:hover, :activate) and pseudo-elements(::before). I used a couple other selectors not already named like descendant and attribute.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - I downloaded vite. The header and footer are constant and the body is what changes.
- [x] **Components** - I created all of the jsx components and tehy are bundled using vite. When changing tabs it doesn't go to new html pages rather it changes the body.
- [x] **Router** - All of my routes are available in my "app.jsx" and I use thouse routes in each of my jsx files.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **All functionality implemented or mocked out** - All functionality is complete. A user can sign in and add, delete, and edit their subscriptions. The app will display all subscriptions on the dashboard pay and calculate the monthly total, determine the most common category, etc. The app also saves information across users.
- [x] **Hooks** - I used hooks all throughout my program. I used hooks like useState, useEffect, useNavigate, etc.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
