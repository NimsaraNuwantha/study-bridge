// StudyBridge - shared JavaScript
// Each feature checks that its elements exist, so one file works on every page.

document.addEventListener("DOMContentLoaded", function () {
  setupMenu();
  setupFaq();
  setupResourceFilter();
  setupPlanner();
  setupContactForm();
  setYear();
});

// 1. Mobile menu: show/hide the navigation on small screens
function setupMenu() {
  var button = document.getElementById("menu-toggle");
  var nav = document.getElementById("main-nav");
  if (!button || !nav) return;
  button.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen);
  });
}

// 2. FAQ accordion: expand/collapse answers
function setupFaq() {
  var questions = document.querySelectorAll(".faq-question");
  questions.forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.parentElement;
      var isOpen = item.classList.toggle("open");
      q.setAttribute("aria-expanded", isOpen);
    });
  });
}

// 3. Resource search + category filter
function setupResourceFilter() {
  var search = document.getElementById("resource-search");
  var buttons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".resource-card");
  var message = document.getElementById("resource-count");
  if (!search || cards.length === 0) return;

  var category = "all";

  function apply() {
    var term = search.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var matchesText = card.textContent.toLowerCase().indexOf(term) !== -1;
      var matchesCat = category === "all" || card.dataset.category === category;
      var visible = matchesText && matchesCat;
      card.style.display = visible ? "" : "none";
      if (visible) shown++;
    });
    message.textContent = shown + " resource" + (shown === 1 ? "" : "s") + " found";
  }

  search.addEventListener("input", apply);
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      buttons.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      category = b.dataset.filter;
      apply();
    });
  });
  apply();
}

// 4. Study planner: study-hours calculator and GPA calculator
function setupPlanner() {
  var hoursForm = document.getElementById("hours-form");
  if (hoursForm) {
    hoursForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var subjects = Number(document.getElementById("subjects").value);
      var days = Number(document.getElementById("days").value);
      var perDay = Number(document.getElementById("hours-per-day").value);
      var out = document.getElementById("hours-result");

      if (subjects < 1 || days < 1 || perDay <= 0) {
        out.textContent = "Please enter positive numbers in every field.";
        return;
      }
      var total = days * perDay;
      var perSubject = total / subjects;
      out.textContent = "You have " + total.toFixed(1) + " study hours in total, about " +
        perSubject.toFixed(1) + " hours for each subject.";
    });
  }

  var gpaForm = document.getElementById("gpa-form");
  if (gpaForm) {
    gpaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var rows = document.querySelectorAll(".gpa-row");
      var totalPoints = 0;
      var totalCredits = 0;
      rows.forEach(function (row) {
        var credits = Number(row.querySelector(".credits").value);
        var grade = row.querySelector(".grade").value;
        if (credits > 0 && grade !== "") {
          totalPoints += credits * Number(grade);
          totalCredits += credits;
        }
      });
      var out = document.getElementById("gpa-result");
      if (totalCredits === 0) {
        out.textContent = "Enter credits and choose a grade for at least one module.";
      } else {
        out.textContent = "Your GPA is " + (totalPoints / totalCredits).toFixed(2) +
          " from " + totalCredits + " credits.";
      }
    });
  }
}

// 5. Contact form validation (nothing is sent anywhere; this is a static site)
function setupContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  function showError(id, text) {
    document.getElementById(id + "-error").textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var topic = document.getElementById("topic").value;
    var message = document.getElementById("message").value.trim();
    var ok = true;

    showError("name", "");
    showError("email", "");
    showError("topic", "");
    showError("message", "");

    if (name.length < 2) { showError("name", "Please enter your name (at least 2 letters)."); ok = false; }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { showError("email", "Please enter a valid email address."); ok = false; }
    if (topic === "") { showError("topic", "Please choose a topic."); ok = false; }
    if (message.length < 10) { showError("message", "Message must be at least 10 characters."); ok = false; }

    var success = document.getElementById("form-success");
    if (ok) {
      success.hidden = false;
      success.textContent = "Thank you, " + name + "! Your message has been checked. " +
        "(This demo site does not store or send messages.)";
      form.reset();
    } else {
      success.hidden = true;
    }
  });
}

// 6. Footer year
function setYear() {
  var span = document.getElementById("year");
  if (span) span.textContent = new Date().getFullYear();
}
