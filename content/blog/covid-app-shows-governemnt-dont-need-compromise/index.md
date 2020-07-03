---
title: "The COVID App That Shows How Governments Don't Need To Compromise On Data Privacy"
description: 'Immuni is safe, and private. The Italian government is showing the world how data privacy can be achieved by any entity'
date: '2020-06-17'
tags: 'COVID-19_Contact Tracing_Government_Data Privacy'
---

![](https://raw.githubusercontent.com/danilo-delbusso/blog/master/content/blog/covid-app-shows-governemnt-dont-need-compromise/covid-article.jpg)
Starting on the 15th of June, the Italian Government enabled nationwide downloads of their Contact Tracing app, [Immuni](https://www.immuni.italia.it/ "https://www.immuni.italia.it/"). The app allows for effortless tracing of SARS-Cov-2 virus.

Though built in less than two months under heavy government guidance and scrutiny, it has been praised for its security and data protection policies.

As its approach to critical design decisions is likely to be replicated in the future by other governments, it is worthwhile to dig deeper and analyse how the app works and how it protects the user from attacks and government officials.

## How it works

Immuni is based on a version of the Bluetooth wireless data transmission technology (BLE), like that which allows a pair of wireless headphones to connect to their smartphone and which Apple and Google have unlocked in their operating systems, making it accessible even for a different and unimaginable purpose before the pandemic, including contact tracing.

After downloading and starting it, Immuni does not require user interaction that goes beyond enabling system-wide Bluetooth connectivity. The application generates an alphanumeric key daily from which it produces an identification code, which is then broadcast by the smartphone via Bluetooth for about 15 minutes. Upon expiry of the ID, Immuni generates a new one, always linked to the same key known only to the application. In this way, it becomes practically impossible for an attacker to trace from an ID to a specific smartphone.

![](https://raw.githubusercontent.com/danilo-delbusso/blog/master/content/blog/covid-app-shows-governemnt-dont-need-compromise/covid-19-app-1.png)

Smartphones with Immuni that come into each other's vicinity exchange IDs and record the information exclusively in their memory, without any external exchange of data. With an excellent approximation, the app also calculates the distance and time between enabled devices to estimate if the proximity to a person who turned out to be positive was sufficient for infection.

## Main Data Privacy Concerns and Solutions

The [official documentation](https://github.com/immuni-app/immuni-documentation "https://github.com/immuni-app/immuni-documentation") extensively covers the security measures put in place by the developers. Some of the main issues faced by the team are however more relevant to this type of application.

## Packet Sniffing

Passive analysis of network traffic could allow a potential attacker to identify infected individuals if the app communicates with the back-end only when flagging a user as having contracted the virus, or by inferring user information for packet size discrepancies.

The solution adopted by Immuni is to send periodic fake data to the server, "dummy data", which is mixed with genuine data. The server manages this data with a pattern equal to that used for non-dummy uploads.

Fake contagion data has the same size and structure as the valid one, and the server, even when it discards it, returns an answer with a non-zero time which is identical to the one it returns for the valid data.

![](https://raw.githubusercontent.com/danilo-delbusso/blog/master/content/blog/covid-app-shows-governemnt-dont-need-compromise/covid-19-app-2.png)

## Exposure Notifications

Exposure Notifications are implemented at Google Play Services level. This ensures the exchange of Bluetooth packets when the app isn't active. However, that app wakes up periodically to check the data it's received and potentially warn the user. For this Immuni uses WorkManager which, thanks to a local database, guarantees the correct execution of these periodic tasks.

However, as one of the developers pointed out in an [AMAA on Reddit](https://www.reddit.com/r/italy/comments/h9c53o/siamo_bending_spoons_e_abbiamo_sviluppato_lapp/ "https://www.reddit.com/r/italy/comments/h9c53o/siamo_bending_spoons_e_abbiamo_sviluppato_lapp/") (in Italian):

> Despite all these precautions, some models of Android devices adopt task management policies in the background that could compromise the execution of the aforementioned tasks. Google and various manufacturers are working to resolve the problem and therefore [we are] optimistic that this issue will be addressed soon.

## Avoiding Service Disruption or Alteration

Immuni signs the cryptographic keys it downloads from its Exposure Reporting Service using a signature algorithm.

The associated public keys are shared with Apple and Google and are used by mobile devices to verify the downloaded data and to ensure its authenticity and integrity.

Analytics of epidemiological information is also a potential issue as they are key for guiding the response of the Italian National Healthcare System. Immuni seeks to guarantee the integrity of the data it stores while applying measures to preserve user privacy. Since on Android no technology identifies genuine devices without compromising user privacy, only iPhone devices connect to the Analytics Service via the [DeviceCheck framework](https://developer.apple.com/documentation/devicecheck "https://developer.apple.com/documentation/devicecheck").

## Conclusion

When first announced, the app gained considerable traction from the press: the idea of contact tracing seemed promising, but raised many doubts on the topic of the protection of personal data. The Italian public opinion shifted towards discarding an option that would mimic the intrusive South Korean architecture.

The Government has already provided important reassurances on its website and committed early on in releasing the source code on [GitHub](https://github.com/immuni-app "https://github.com/immuni-app"). Furthermore, the investigation by [Mobisec](https://mobisec.com/ "https://mobisec.com/"), an Italian company which since 2017 certifies the mobile security of important companies, has further confirmed the particular attention to the issue of privacy.

Mobisec’s study aimed at identifying security and privacy concerns highlighted an overall quality level above average

> “Implementation was [also] carried out according to the best practices available at the state of the art and with the most modern development and Quality Assurance tools which makes Immuni an app actually above the quality that we often find in our daily security analysis activities, assessment and testing.” - Alberto Zannol CEO & Founder of Mobisec

Immuni is safe and should be used by anyone who wants to help fight the virus in the post lockdown phase. The Italian Government proved how it is possible, efficient, and secure for a government agency to develop with data security in mind. It has done so within the space of a couple of months and released an application to the entire population with minimal cost.