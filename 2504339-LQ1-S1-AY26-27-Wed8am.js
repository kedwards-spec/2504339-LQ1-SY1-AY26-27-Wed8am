/*
Q6-Q16: CIT2011 Lab Quiz #1 - JavaScript Functionality
Fullname: Kortisha Edwards
ID#: 2504339
Day/Time of Lab: Wednesday/8AM
Assignment: CIT2011 Lab Quiz #1
Assignment Date/Time: November 20, 2026/8AM
*/

// Q13: Create an array to track vehicle registrations.
let registrations = [];

// Q14: Create an object that uses licence plate numbers as unique retrieval keys.
let registrationLookup = {};

// Q13: Define the LocalStorage key.
const STORAGE_KEY = "vehicleRegistrations";

// Q6: Assign registration units to each vehicle category.
const vehicleUnits = {
    motorcycle: 1,
    private: 2,
    suv: 3,
    commercial: 4
};

// Q7 and Q9: Define the registration fees.
const UNIT_FEE = 2000;
const INSPECTION_FEE = 2500;


// Q2-Q3: Retrieve the HTML form elements.
const registrationForm = document.getElementById("registrationForm");

const ownerName = document.getElementById("ownerName");
const ownerId = document.getElementById("ownerId");
const make = document.getElementById("make");
const model = document.getElementById("model");
const year = document.getElementById("year");
const category = document.getElementById("category");
const plate = document.getElementById("plate");
const inspection = document.getElementById("inspection");

// Q3 and Q11: Retrieve the validation message elements.
const ownerNameError = document.getElementById("ownerNameError");
const ownerIdError = document.getElementById("ownerIdError");
const plateError = document.getElementById("plateError");

// Q7-Q10: Retrieve the fee display elements.
const grossFeeDisplay = document.getElementById("grossFee");
const discountDisplay = document.getElementById("discount");
const inspectionFeeDisplay = document.getElementById("inspectionFee");
const totalFeeDisplay = document.getElementById("totalFee");

// Q13, Q15 and Q16: Retrieve the records and feedback elements.
const recordsList = document.getElementById("recordsList");
const formMessage = document.getElementById("formMessage");
const clearRecordsButton = document.getElementById("clearRecords");


// Q7: Format amounts as Jamaican currency.
function formatMoney(amount) {
    return "JMD " + amount.toLocaleString("en-JM", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// Q11: Display validation feedback and update the input field appearance.
function showMessage(input, messageElement, message, isValid) {
    messageElement.textContent = message;

    input.classList.remove("valid", "invalid");
    messageElement.classList.remove("success", "error");

    input.classList.add(isValid ? "valid" : "invalid");
    messageElement.classList.add(isValid ? "success" : "error");

    input.setAttribute("aria-invalid", String(!isValid));

    return isValid;
}


// Q11(a): Validate the owner's full name.
// The name must contain at least two names and three non-space characters.
function validateName() {
    const name = ownerName.value.trim();
    const nameParts = name.split(/\s+/);
    const characterCount = name.replace(/\s/g, "").length;

    if (nameParts.length >= 2 && characterCount >=3) {
        return showMessage(
            ownerName,
            ownerNameError,
            "Valid full name.",
            true
        );
    }else {

    return showMessage(
        ownerName,
        ownerNameError,
        "Enter your first and last name",
        false
        );
    }
}


// Q11(b): Validate the UTech ID.
// The ID must contain exactly seven numeric characters.
function validateId() {
    const id = ownerId.value.trim();

    if (/^\d{7}$/.test(id)) {
        return showMessage(
            ownerId,
            ownerIdError,
            "Valid UTech ID.",
            true
        );
    }

    return showMessage(
        ownerId,
        ownerIdError,
        "UTech ID must contain exactly 7 digits.",
        false
    );
}


// Q11(c): Convert the licence plate to uppercase before validating.
// Requirement: three uppercase letters followed by four digits.
function validatePlate() {
    plate.value = plate.value.toUpperCase().trim();

    if (/^[A-Z]{3}\d{4}$/.test(plate.value)) {
        return showMessage(
            plate,
            plateError,
            "Valid licence plate format.",
            true
        );
    }

    return showMessage(
        plate,
        plateError,
        "Enter 3 letters followed by 4 digits (e.g. ABC1234).",
        false
    );
}


// Q11: Attach predictive validation to the input and blur events.
ownerName.addEventListener("input", validateName);
ownerName.addEventListener("blur", validateName);

ownerId.addEventListener("input", validateId);
ownerId.addEventListener("blur", validateId);

plate.addEventListener("input", validatePlate);
plate.addEventListener("blur", validatePlate);


// Q6-Q10: Calculate registration fees and update the page.
function calculateFees() {

    // Q6: Retrieve the registration units for the selected category.
    const units = vehicleUnits[category.value] || 0;

    // Q7: Calculate gross fee using units multiplied by JMD 2,000.
    const grossFee = units * UNIT_FEE;

    // Q8: Apply a 10% discount to Online Renewal only.
    const selectedType = document.querySelector(
        'input[name="registrationType"]:checked'
    ).value;

    const discount = selectedType === "renewal"
        ? grossFee * 0.10
        : 0;

    // Q9: Add the optional roadworthiness inspection fee.
    const inspectionCost = inspection.checked
        ? INSPECTION_FEE
        : 0;

    // Q10: Calculate the final registration total.
    const finalTotal = grossFee - discount + inspectionCost;

    // Q7-Q10: Display the calculated fees.
    grossFeeDisplay.textContent = formatMoney(grossFee);
    discountDisplay.textContent = formatMoney(discount);
    inspectionFeeDisplay.textContent = formatMoney(inspectionCost);
    totalFeeDisplay.textContent = formatMoney(finalTotal);

    return {
        grossFee: grossFee,
        discount: discount,
        inspectionFee: inspectionCost,
        totalFee: finalTotal
    };
}


// Q6-Q10: Recalculate fees whenever the relevant controls change.
category.addEventListener("change", calculateFees);

document.querySelectorAll('input[name="registrationType"]').forEach(
    function (radio) {
        radio.addEventListener("change", calculateFees);
    }
);

inspection.addEventListener("change", calculateFees);


// Q14: Rebuild the licence plate lookup object from the registration array.
function buildRegistrationLookup() {
    registrationLookup = {};

    registrations.forEach(function (registration) {
        registrationLookup[registration.plate] = registration;
    });
}


// Q15: Dynamically display the saved registration records.
function displayRegistrations() {
    recordsList.innerHTML = "";

    if (registrations.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent =
            "No vehicle registrations have been saved yet.";

        recordsList.appendChild(emptyMessage);
        return;
    }

    registrations.forEach(function (registration) {
        const card = document.createElement("article");
        card.className = "record-card";

        const heading = document.createElement("h3");
        heading.textContent =
            registration.make + " " + registration.model;

        card.appendChild(heading);

        const details = [
            "Owner: " + registration.ownerName,
            "UTech ID: " + registration.ownerId,
            "Vehicle Year: " + registration.year,
            "Category: " + registration.categoryName,
            "Licence Plate: " + registration.plate,
            "Registration Type: " + registration.registrationTypeName,
            "Inspection: " +
                (registration.inspection ? "Included" : "Not Included"),
            "Gross Fee: " + formatMoney(registration.fees.grossFee),
            "Discount: " + formatMoney(registration.fees.discount),
            "Inspection Fee: " + formatMoney(registration.fees.inspectionFee),
            "Final Total: " + formatMoney(registration.fees.totalFee),
            "Date Saved: " + registration.dateSaved
        ];

        details.forEach(function (detail) {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            card.appendChild(paragraph);
        });

        recordsList.appendChild(card);
    });
}


// Q15: Retrieve saved registrations when the page is initialised.
function loadRegistrations() {
    try {
        const savedRecords = localStorage.getItem(STORAGE_KEY);

        if (savedRecords !== null) {
            const parsedRecords = JSON.parse(savedRecords);

            if (!Array.isArray(parsedRecords)) {
                throw new Error("Saved registration data is not an array.");
            }

            registrations = parsedRecords;
        } else {
            registrations = [];
        }

        // Q14: Rebuild the primary retrieval lookup using licence plates.
        buildRegistrationLookup();

        // Q15: Display the saved registrations.
        displayRegistrations();

    } catch (error) {
        // Q12: Handle errors when retrieving or parsing LocalStorage data.
        console.error("Unable to load saved registrations:", error);

        registrations = [];
        registrationLookup = {};

        recordsList.textContent =
            "Saved records could not be loaded. Please check the stored data.";
    }
}


// Q13: Handle registration form submission.
registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Q11: Check predictive validation results before registration.
    const nameIsValid = validateName();
    const idIsValid = validateId();
    const plateIsValid = validatePlate();

    if (!nameIsValid || !idIsValid || !plateIsValid) {
        formMessage.textContent =
            "Please correct the highlighted fields before registering.";
        formMessage.style.color = "#c62828";
        return;
    }

    // Q13: Check that all remaining required fields contain values.
    if (
        make.value.trim() === "" ||
        model.value.trim() === "" ||
        year.value.trim() === "" ||
        category.value === ""
    ) {
        formMessage.textContent =
            "Please complete all required vehicle information.";
        formMessage.style.color = "#c62828";
        return;
    }

    // Q13: Check that the vehicle year is a valid whole number.
    const vehicleYear = Number(year.value);

    if (!Number.isInteger(vehicleYear) || vehicleYear <= 0) {
        formMessage.textContent =
            "Please enter a valid vehicle year.";
        formMessage.style.color = "#c62828";
        return;
    }

    // Q14: Use the licence plate as the primary retrieval key.
    // Prevent a duplicate licence plate from being registered.
    const plateNumber = plate.value;

    if (registrationLookup[plateNumber]) {
        formMessage.textContent =
            "This licence plate is already registered.";
        formMessage.style.color = "#c62828";
        return;
    }

    // Q8: Retrieve the selected registration type.
    const registrationType = document.querySelector(
        'input[name="registrationType"]:checked'
    ).value;

    // Q7-Q10: Calculate the fees for the registration.
    const fees = calculateFees();

    // Q13: Compile the form values and fees into an organised object.
    const newRegistration = {
        ownerName: ownerName.value.trim(),
        ownerId: ownerId.value.trim(),
        make: make.value.trim(),
        model: model.value.trim(),
        year: vehicleYear,
        category: category.value,
        categoryName: category.options[category.selectedIndex].text,
        plate: plateNumber,
        registrationType: registrationType,
        registrationTypeName:
            registrationType === "renewal"
                ? "Online Renewal"
                : "New Registration",
        inspection: inspection.checked,
        fees: fees,
        dateSaved: new Date().toLocaleString()
    };

    // Q13 and Q12: Add the object to the array and save it in LocalStorage.
    try {
        registrations.push(newRegistration);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(registrations)
        );

        // Q14: Update the licence plate retrieval lookup.
        registrationLookup[plateNumber] = newRegistration;

        // Q15: Refresh the displayed registration records.
        displayRegistrations();

        formMessage.textContent =
            "Vehicle registration saved successfully!";
        formMessage.style.color = "#16803c";

        // Q13: Reset the form after successful registration.
        registrationForm.reset();

        // Q11: Clear the previous validation states.
        [ownerName, ownerId, plate].forEach(function (input) {
            input.classList.remove("valid", "invalid");
            input.removeAttribute("aria-invalid");
        });

        [ownerNameError, ownerIdError, plateError].forEach(
            function (message) {
                message.textContent = "";
                message.classList.remove("success", "error");
            }
        );

        // Q7-Q10: Reset the fee display.
        calculateFees();

    } catch (error) {
        // Q12: Handle errors that occur while saving registration data.
        console.error("Unable to save registration:", error);

        registrations.pop();
        buildRegistrationLookup();

        formMessage.textContent =
            "An error occurred while saving. Please try again.";
        formMessage.style.color = "#c62828";
    }
});


// Q16: Clear saved records after asking the user to confirm.
clearRecordsButton.addEventListener("click", function () {
    const confirmation = confirm(
        "Are you sure you want to clear all saved vehicle registration records?"
    );

    if (confirmation) {
        try {
            // Q16: Remove the relevant LocalStorage entry.
            localStorage.removeItem(STORAGE_KEY);

            // Q16: Clear the registration array and retrieval lookup.
            registrations = [];
            registrationLookup = {};

            // Q16: Clear the displayed registration records.
            displayRegistrations();

            formMessage.textContent =
                "All saved vehicle records have been cleared.";
            formMessage.style.color = "#16803c";

        } catch (error) {
            // Q12 and Q16: Handle errors when clearing stored records.
            console.error("Unable to clear saved records:", error);

            formMessage.textContent =
                "An error occurred while clearing the records.";
            formMessage.style.color = "#c62828";
        }
    }
});


// Q13: Clear validation messages when the form is reset.
registrationForm.addEventListener("reset", function () {
    setTimeout(function () {
        [ownerName, ownerId, plate].forEach(function (input) {
            input.classList.remove("valid", "invalid");
            input.removeAttribute("aria-invalid");
        });

        [ownerNameError, ownerIdError, plateError].forEach(
            function (message) {
                message.textContent = "";
                message.classList.remove("success", "error");
            }
        );

        formMessage.textContent = "";
        calculateFees();
    }, 0);
});


// Q15: Initialise the page by loading saved registrations.
document.addEventListener("DOMContentLoaded", function () {
    loadRegistrations();

    // Q7-Q10: Show the initial fee values.
    calculateFees();
});