const projectNameText = document.getElementById("project-name-input");

let selectedProject = "";
let projectCounter = 1;

document.getElementById("create-project-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const projectNameInput = projectNameText.value;
    fetch(`https://chunk-issue-tracker-d7377a2244ef.herokuapp.com/api/${projectNameInput}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: "create project"})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) return console.log(data.error);
        document.getElementById("select-project").innerHTML += `
            <option value="${projectNameInput}" id="project-${projectCounter}">${projectNameInput}</option>`;
        selectedProject = projectNameInput;
        document.getElementById("project-name-span").innerText = selectedProject;
        projectCounter++;
    })
    .catch(error => {
        console.error("CLIENT Error:", error);
        alert("An error occurred. Please try again.");
    });
});

document.getElementById("select-project-btn").addEventListener("click", (event) => {
    event.preventDefault();
    selectedProject = document.getElementById("select-project").value;
    document.getElementById("project-name-span").innerText = selectedProject;
})

const submitTitleInput = document.getElementById("title-submit");
const submitTextInput = document.getElementById("text-submit");
const submitCreatedByInput = document.getElementById("created-by-submit");
const submitAssignedToInput = document.getElementById("assigned-to-submit");
const submitStatusTextInput = document.getElementById("status-text-submit");

document.getElementById("submit-btn").addEventListener("click", (event) => {
    event.preventDefault();
    if (selectedProject === "") return alert("Select a project");
    const titleInput = submitTitleInput.value;
    const textInput = submitTextInput.value;
    const createdByInput = submitCreatedByInput.value;
    const assignedToInput = submitAssignedToInput.value ? submitAssignedToInput.value : "";
    const statusTextInput = submitStatusTextInput.value ? submitStatusTextInput.value : "";
    fetch(`https://chunk-issue-tracker-d7377a2244ef.herokuapp.com/api/issues/${selectedProject}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({
            issue_title: titleInput,
            issue_text: textInput,
            created_by: createdByInput,
            assigned_to: assignedToInput,
            status_text: statusTextInput
            })
    })  .then(response => response.json())
        .then(data => {
            if (data.error) return console.log(data.error);
            console.log(data);
            document.getElementById("results-span").innerText = JSON.stringify(data);
        })
        .catch(error => {
            console.error("CLIENT Error:", error);
            alert("An error occurred. Please try again.");
        });
});

const find_idInput = document.getElementById("_id-find");
const findTitleInput = document.getElementById("title-find");
const findTextInput = document.getElementById("text-find");
const findCreatedByInput = document.getElementById("created-by-find");
const findAssignedToInput = document.getElementById("assigned-to-find");
const findStatusTextInput = document.getElementById("status-text-find");
const findCreatedOnInput = document.getElementById("created-on-find");
const findUpdatedOnInput = document.getElementById("updated-on-find");

document.getElementById("find-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams();
    const _idInput = find_idInput.value;
    if (_idInput) urlParams.append("_id", _idInput);
    const titleInput = findTitleInput.value;
    if (titleInput) urlParams.append("issue_title", titleInput);
    const textInput = findTextInput.value;
    if (textInput) urlParams.append("issue_text", textInput);
    const createdByInput = findCreatedByInput.value;
    if (createdByInput) urlParams.append("created_by", createdByInput);
    const assignedToInput = findAssignedToInput.value;
    if (assignedToInput) urlParams.append("assigned_to", assignedToInput);
    const statusTextInput = findStatusTextInput.value;
    if (statusTextInput) urlParams.append("status_text", statusTextInput);
    const createdOnInput = findCreatedOnInput.value;
    if (createdOnInput) urlParams.append("created_on", createdOnInput);
    const updatedOnInput = findUpdatedOnInput.value;
    if (updatedOnInput) urlParams.append("updated_on", updatedOnInput);

    // Fetch issues from the /api/issues/:project/find endpoint
    fetch(`/api/issues/${selectedProject}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) return console.log(data.error);

            // Redirect to issues.html and pass the data as a query parameter
            const issuesUrl = new URL(window.location.origin + '/issues.html');
            issuesUrl.searchParams.append('issues', JSON.stringify(data));  // Add issues as a query parameter
            window.location.href = issuesUrl; // Navigate to the issues page
        })
        .catch(error => {
            console.error("CLIENT Error:", error);
            alert("An error occurred. Please try again.");
        });
});

const _idToUpdateInput = document.getElementById("_id-update");
const updateTitleInput = document.getElementById("title-update");
const updateTextInput = document.getElementById("text-update");
const updateCreatedByInput = document.getElementById("created-by-update");
const updateAssignedToInput = document.getElementById("assigned-to-update");
const updateStatusTextInput = document.getElementById("status-text-update");

document.getElementById("update-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const _idToUpdate = _idToUpdateInput.value;
    const titleInput = updateTitleInput.value ? updateTitleInput.value : "";
    const textInput = updateTextInput.value ? updateTextInput.value : "";
    const createdByInput = updateCreatedByInput.value ? updateCreatedByInput.value : "";
    const assignedToInput = updateAssignedToInput.value ? updateAssignedToInput.value : "";
    const statusTextInput = updateStatusTextInput.value ? updateStatusTextInput.value : "";
    fetch(`https://chunk-issue-tracker-d7377a2244ef.herokuapp.com/api/issues/${selectedProject}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({
            _id: _idToUpdate,
            issue_title: titleInput,
            issue_text: textInput,
            created_by: createdByInput,
            assigned_to: assignedToInput,
            status_text: statusTextInput
            })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) return console.log(data.error);
            console.log(data);
            document.getElementById("results-span").innerText = JSON.stringify(data);
        })
        .catch(error => {
            console.error("CLIENT Error:", error);
            alert("An error occurred. Please try again.");
        });
});

const deleteIssueInput = document.getElementById("delete-issue-input");

document.getElementById("delete-issue-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const issueToDelete = deleteIssueInput.value;
    fetch(`https://chunk-issue-tracker-d7377a2244ef.herokuapp.com/api/issues/${selectedProject}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({_id: issueToDelete})
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if(data.error) return console.log(data.error);
        console.log(data);
        document.getElementById("results-span").innerText = JSON.stringify(data);
      })
      .catch(error => {
        console.error("CLIENT Error:", error);
        alert("An error occurred. Please try again.");
    });
});