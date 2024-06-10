const steps = document.querySelectorAll(".stp"); // Get all the steps in form
const circleSteps = document.querySelectorAll(".step"); // Get all the navigation circles

const formInputs = document.querySelectorAll(".step-1 form input"); // Collect form inputs from Step 1

const plans = document.querySelectorAll(".plan-card"); // Get all the plans
const switcher = document.querySelector(".switch"); //Get the Switcher
const addons = document.querySelectorAll(".box"); // Get all the addons
const total = document.querySelector(".total b"); // Get the total price
const planPrice = document.querySelector(".plan-price");
// Regular expressions for email and phone number validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;
const step3Checkboxes = document.querySelectorAll(
  ".step-3 input[type='checkbox']"
); // Collect checkboxes from Step 3

let time;
// Current step and circle indicators
let currentStep = 1;
let currentCircle = 0;
//Object to store the values selected by user
const obj = {
  plan: null,
  kind: null,
  price: null,
};

//Loop through each Steps in Form
steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.remove("active");
      currentCircle--;
    });
  }

  // Navigation button event listener
  nextBtn.addEventListener("click", () => {
    document.querySelector(`.step-${currentStep}`).style.display = "none";

    // Validate Step 1 form inputs
    if (currentStep === 1 && !validateForm()) {
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      return;
    }

    // Validate Step 3 checkboxes
    if (currentStep === 3 && !validateStep3()) {
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      return;
    }

    // Proceed to the next step if validation passes
    if (currentStep < 5) {
      currentStep++;
      currentCircle++;
      setTotal();
    }

    // Show the next step
    document.querySelector(`.step-${currentStep}`).style.display = "flex";
    circleSteps[currentCircle].classList.add("active");
    summary(obj);
  });
});

// Function to validate Step 1 form inputs
function validateForm() {
  let valid = true;
  for (let i = 0; i < formInputs.length; i++) {
    const input = formInputs[i];
    if (!input.value) {
      valid = false;
      input.classList.add("err");
      findLabel(input).nextElementSibling.style.display = "flex";
      findLabel(input).nextElementSibling.innerText = "This field is required";
    } else {
      if (input.id === "email" && !emailRegex.test(input.value)) {
        valid = false;
        input.classList.add("err");
        findLabel(input).nextElementSibling.style.display = "flex";
        findLabel(input).nextElementSibling.innerText =
          "Please enter a valid email address";
      } else if (input.id === "phone" && !phoneRegex.test(input.value)) {
        valid = false;
        input.classList.add("err");
        findLabel(input).nextElementSibling.style.display = "flex";
        findLabel(input).nextElementSibling.innerText =
          "Please enter a valid phone number";
      } else {
        input.classList.remove("err");
        findLabel(input).nextElementSibling.style.display = "none";
      }
    }
  }
  return valid;
}

// Function to find the corresponding label for an input field
function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
  }
}

// Add event listeners to each plan element
plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".plan-priced");
    obj.plan = planName;
    obj.price = planPrice;
  });
});

// Add event listener to the switcher element
switcher.addEventListener("click", () => {
  const val = switcher.querySelector("input").checked;
  if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }

  switchPrice(val); // Update prices based on the switch value
  updateAddonPrices(val); // Call the function to update addon prices
  // Update the selected plan summary
  const planType = val ? "Yearly" : "Monthly";
  const planPrice = val ? "$90/yr" : "$9/mo"; //
  updateSelectedPlan(planType, planPrice);
  // Update the global object with the selected kind (monthly/yearly)
  obj.kind = val;
});

// Initial call to update addon prices based on default plan type
updateAddonPrices(switcher.querySelector("input").checked);

// Initial call to update addon prices and selected plan based on default plan type
const defaultPlanType = switcher.querySelector("input").checked
  ? "Yearly"
  : "Monthly";
const defaultPlanPrice = switcher.querySelector("input").checked
  ? "$90/yr"
  : "$9/mo"; // Example prices, replace with dynamic values if needed
updateAddonPrices(switcher.querySelector("input").checked);
updateSelectedPlan(defaultPlanType, defaultPlanPrice);

// Function to switch prices between monthly and yearly
function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const prices = document.querySelectorAll(".plan-priced");
  if (checked) {
    // If yearly is selected, update prices to yearly
    prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
    setTime(true);
  } else {
    // If monthly is selected, update prices to monthly
    prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
    // Set the time to monthly
    setTime(false);
  }
}

// Function to set the time type (monthly/yearly)
function setTime(t) {
  return (time = t);
}

// Add event listeners to each addon element
addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addon.classList.add("ad-selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

// Function to show or hide addons in the summary
function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".servic-price");
  const serviceID = clone.querySelector(".selected-addon");
  if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

// Function to update addon prices based on selected plan type
function updateAddonPrices(isYearly) {
  const addonPrices = document.querySelectorAll(".step-3 .price");
  addonPrices.forEach((priceElement) => {
    const monthlyPrice = priceElement.getAttribute("data-monthly-price");
    const yearlyPrice = priceElement.getAttribute("data-yearly-price");
    if (isYearly) {
      priceElement.innerText = `+$${yearlyPrice}/yr`;
    } else {
      priceElement.innerText = `+$${monthlyPrice}/mo`;
    }
  });
}

// Function to validate Step 3 checkboxes
function validateStep3() {
  let valid = false;
  for (let i = 0; i < step3Checkboxes.length; i++) {
    if (step3Checkboxes[i].checked) {
      valid = true;
      break;
    }
  }
  if (!valid) {
    alert("Please select at least one add-on.");
  }
  return valid;
}

// Function to update the plan name and price in the summary section
function updateSelectedPlan(planType, planPrice) {
  const planNameElement = document.querySelector(".selected-plan .plan-name");
  const planPriceElement = document.querySelector(".selected-plan .plan-price");

  // Update the plan name with the selected plan type (Monthly/Yearly)
  const planName = `Arcade(${planType})`;
  planNameElement.innerText = planName;

  planPriceElement.innerText = planPrice;
}

// Event listener for the "Change" link to navigate back to Step 3
document.querySelector(".plan-change").addEventListener("click", () => {
  // Hide the current step
  document.querySelector(`.step-${currentStep}`).style.display = "none";
  currentStep = 3;
  currentCircle = 2;

  document.querySelector(`.step-${currentStep}`).style.display = "flex";

  // Update the circle steps to reflect the navigation
  circleSteps.forEach((step, index) => {
    if (index <= currentCircle) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
});

// Function to set the total
function setTotal() {
  const str = planPrice.innerHTML;
  const res = str.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll(
    ".selected-addon .servic-price"
  );

  let val = 0;
  for (let i = 0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML;
    const res = str.replace(/\D/g, "");

    val += Number(res);
  }
  total.innerHTML = `+$${val + Number(res)}/${time ? "yr" : "mo"}`;
}

// Function to summarize the selections
function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");
  //   console.log(planPrice);
  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${
    obj.kind ? "yearly" : "monthly"
  })`;
}
