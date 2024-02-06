<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Bug Bridge</h3>

  <p align="center">
    A simple user based node app for tracking and organizing projects and bugs.
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#makingof">The Making Of</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Bug Bridge is a web application built with Express.js and utilizes a PostgreSQL database. It allows users to efficiently track and manage software bugs by providing a user-friendly interface for creating, updating, and resolving issues. With robust features such as user authentication, issue categorization, and detailed status tracking, this app streamlines the bug tracking process for development teams. Extra effor was put into securing the application against different hacking strategies.

Goals of the project:
* Make an application that would aid in the process of designing any and all future applications
* Utilize my knowledge of full stack engineering to create a highly available and secure webb app.

When a use first loads the app at the url [https://bugbridge.duckdns.org](https://bugbridge.duckdns.org), they will be directed to the login page.

![Login Page](bugBridgeLogin.PNG)

After logging in there are two main menus, one for the admins and one for the regular users. As of the current moment admins are the only people who can create projects and access the users data table. Here is a picture of the admin main menu: 

![Main Menu](bugBridgeMainMenu.PNG)

Clicking on the Bugs button will take you to the bugs table. This table pulls all relevant data from the database. An admin can assign your user account to specific projects and the bug table only shows bugs that are related to the projects that your user account is assigned to. 

![Bugs Page](bugBridgeBugsPage.PNG)

From here you can create or update bugs and you may sort the table based on status. Clicking either create or update bug brings up the create/update window. 

![Create Bugs](bugBridgeCreateBugForm.PNG)

More features are planned for the future! See more in the <a href="#roadmap">Roadmap</a> below. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

The application in Node js using the Express js web application framework. It also utilizes a postgres database.

* [![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
* [![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
* [![PostgreSQL](https://img.shields.io/badge/postgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- The making of -->
## The Making Of

To start this project I went through Codecademy's course on how to be a back end engineer. There I deepened my knowledge of javascript, learned about express apps, and learned how to make and utilize api calls. I also learned quite a bit about postgres and how to manage a database efficiently. 

From there I made the back end for this project. This included a new directory called "server" where I created a file for the users, projects, and bugs tables and put api calls to each of these tables in their own files. I then routed these api calls to the main app and made a file called index.js to handle assigning these api calls to their specific routes. Then I made a router to make all of this accessible to the main application which is created in app.js.

Then I got to work on the front end. I used a pink and light grey color scheme because those are two of my favorite colors. :slightly_smiling_face: From here I worked my way through the logic of the application. Creating more api calls as they were needed and figuring out how to grab and utilize specific data. For this project I planned out about a quarter of it and then used a seat of the pants style coding for the rest. In the future I plan to be more thorough in whiteboarding out the process before beginning, but since this project was my first real foray into full stack engineering I decided to learn by doing. 

When I started working on the login page I learned about sessions and cookies. I used passport to implement user authentication and implemented user authorization for added security. After getting the bugs, users, and projects tables working and the login page successfully logging in users I began the process of implementing as much security as possible. This included data hashing and preventing CSRF attacks, XSS attacks, and sql injections as well as other defensive measures. 

Then I began the process of creating containers on my home server for the application and the database. This step was probably the most difficult because I had been learning so much about the developer side of things and was suddenly thrust into the ops world. It was also one of the most rewarding though and I got to utilize the limited knowledge I have of dev ops practices. The main thing I learned during this step of the process was implementing a reverse proxy for improved server security.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Add Changelog
- [ ] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Lilly - [@your_twitter](https://twitter.com/your_username) - lilly.ashbury@gmail.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
