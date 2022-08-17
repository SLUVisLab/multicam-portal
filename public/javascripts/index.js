window.onload = (event) => {
    console.log('page is fully loaded');
    const sites = document.getElementById('site');
    const blocks = document.getElementById('block');
    const sessions_table = document.getElementById('sessions-table')
    var data 

    function loadSites() {
      for(site of data) {
              var option = new Option(site.name, site.name)
              sites.appendChild(option)
            }

      // The blocks event listener doesn't fire when sites are first loaded so we call the function here
      if(Array.from(blocks).length < 1) {
        loadBlocks(sites.value)
      }
    }

    function loadBlocks(siteName) {
      const index = data.map(e => e.name).indexOf(siteName);

      Array.from(blocks).forEach((option) => {
        blocks.removeChild(option)
      })
      
      // As of now, block number is required for search
      // But if it wasn't... you could add an empty option like this:
      //- var option = new Option("<None>", null, true, true)
      //- blocks.appendChild(option)

      for(block of data[index].blocks) {
        var option = new Option(block, block)
        blocks.appendChild(option)
      }  
    }

    function loadSessions(sessions) {
      for(let i = 0; i < sessions.length; i++) {
        
        //- let d = new Date(sessions[i].sessionStart)

        var row = sessions_table.insertRow(i+1)
        var cell0 = row.insertCell(0)
        var cell1 = row.insertCell(1)
        var cell2 = row.insertCell(2)
        var cell3 = row.insertCell(3)

        cell0.innerHTML = sessions[i].siteId
        cell1.innerHTML = sessions[i].blockId
        cell2.innerHTML = sessions[i].imageCount
        cell3.innerHTML = sessions[i].sessionStart
      }
    }

    sites.addEventListener("change", (event) => {
      loadBlocks(sites.value)
    })

    fetch('/info/sites')
      .then(response => {
        response.json()
          .then(json => {
            data = json
            loadSites()
          })
      })

    fetch('/info/sessions')
      .then(response => {
        response.json()
          .then(json => {
            console.log(json)
            loadSessions(json)
          })
      })
  };