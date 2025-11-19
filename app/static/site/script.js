let handler = null
document.addEventListener("DOMContentLoaded", function () {
    new QWebChannel(qt.webChannelTransport, function (channel) {
        // Initializes the backend handler
        window.handler = channel.objects.handler;
        // References to DOM elements
        const folderPathInput = document.getElementById('folderPath');
        const directorySelectorButton = document.getElementById('directorySelectorButton');
        const fromExtensionensionInput = document.getElementById('fromExtensionension');
        const toExtensionensionInput = document.getElementById('toExtensionension');
        const convertButton = document.getElementById('convertButton');
        const clearBtn = document.getElementById('clearBtn');
        const statusMessage = document.getElementById('statusMessage');
        // State Variable
        let selectedFolderPath = '';
        // Validates input fields
        function validateInputs() {
            const fromExtension = fromExtensionensionInput.value.trim();
            const toExtension = toExtensionensionInput.value.trim();
            // Check if folder path is "selected" and extensions are valid
            const isValid = selectedFolderPath !== '' &&
                fromExtension.length > 1 && fromExtension.startsWith('.') &&
                toExtension.length > 1 && toExtension.startsWith('.');

            // Changes state based on validity condition
            if (isValid) {
                statusMessage.innerText = "Ready to convert files."
                convertButton.disabled = false
            } else {
                statusMessage.innerText = "Please select a folder and enter extensions to begin."
                convertButton.disabled = true
            }
        }
        // Connects to handler after handler loads
        if (window.handler) {
            // Checks for the directory selector to emit a directory path
            window.handler.directoryPathSelected.connect(function (path) {
                folderPathInput.value = path;
                selectedFolderPath = path;
                validateInputs();
            });
        }
        /* On-Click button listeners */
        directorySelectorButton.addEventListener("click", function () {
            window.handler.directorySelectorButtonClicked();
            validateInputs()
        });
        convertButton.addEventListener("click", function () {
            path = folderPathInput.value
            from = fromExtensionensionInput.value.trim()
            to = toExtensionensionInput.value.trim()

            window.handler.convertButtonClicked(path, from, to);
        });
        clearBtn.addEventListener('click', () => {
            folderPathInput.value = '';
            selectedFolderPath = '';
            fromExtensionensionInput.value = '';
            toExtensionensionInput.value = '';
            statusMessage.textContent = 'Please select a folder and enter extensions to begin';
            convertButton.disabled = true; // Disable convert button
        });
        fromExtensionensionInput.addEventListener('input', validateInputs);
        toExtensionensionInput.addEventListener('input', validateInputs);
        // Initial validation on load
        validateInputs();
    });
});
// Prevents zooming-in
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) { 
        event.preventDefault(); 
    }
}, { passive: false });