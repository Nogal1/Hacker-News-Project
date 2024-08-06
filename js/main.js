"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoritedStories = $("#favorited-stories");
const $ownStories = $("#my-stories");
const $storiesContainer = $("#stories-container")

// selector that finds all three story lists
const $storiesLists = $(".stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $submitForm = $("#submit-form");

const $navSubmitStory = $("#nav-submit-story");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

const $userProfile = $("#user-profile");

// for infinite scroll
let lastStoryLoaded = 0;
const STORIES_PER_LOAD = 10;

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $storiesLists,
    $submitForm,
    $loginForm,
    $signupForm,
    $userProfile
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();

  // setup infinite scroll
  $(window).on('scroll', async function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      await loadMoreStories();
    }
  });
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);

/** Function to load more stories for infinite scroll */
async function loadMoreStories() {
  const newStories = await storyList.getMoreStories(lastStoryLoaded, STORIES_PER_LOAD);
  lastStoryLoaded += STORIES_PER_LOAD;
  putStoriesOnPage(newStories);
}
