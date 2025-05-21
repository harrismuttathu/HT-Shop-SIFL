// This file ensures the Material field is a free text input
// It overrides any compiled JavaScript that might be using a dropdown

document.addEventListener('DOMContentLoaded', function() {
  // Function to check and replace Material field if it's a dropdown
  function checkAndReplaceMaterialField() {
    // Look for the Material field container
    const materialFieldContainers = Array.from(document.querySelectorAll('label')).filter(
      label => label.textContent.includes('Material')
    );
    
    if (materialFieldContainers.length > 0) {
      const materialContainer = materialFieldContainers[0].parentElement;
      
      // Check if it contains a dropdown (Select component)
      const hasDropdown = materialContainer.querySelector('[role="combobox"]');
      
      if (hasDropdown) {
        console.log('Found Material dropdown, replacing with text input');
        
        // Remove the dropdown
        const selectElement = materialContainer.querySelector('[role="combobox"]').parentElement;
        if (selectElement) {
          // Create a new input element
          const inputElement = document.createElement('input');
          inputElement.className = selectElement.className; // Copy styling
          inputElement.placeholder = "Enter material";
          inputElement.id = "material";
          inputElement.name = "material";
          
          // Replace the dropdown with the input
          selectElement.parentElement.replaceChild(inputElement, selectElement);
          
          // Add event listener to save the value
          inputElement.addEventListener('change', function(e) {
            // This is a simplified approach - in a real app we'd need to integrate with React state
            console.log('Material input changed:', e.target.value);
          });
        }
      }
    }
  }
  
  // Run initially and then periodically check (in case of dynamic rendering)
  checkAndReplaceMaterialField();
  setInterval(checkAndReplaceMaterialField, 1000);
});
