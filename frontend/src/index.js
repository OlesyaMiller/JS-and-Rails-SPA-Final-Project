const BASE_URL = "http://localhost:3000"
const TRIPS_URL = `${BASE_URL}/trips`

document.addEventListener("DOMContentLoaded", () => {
    getTypes()
    getAreas()
})

const getTypes = () => {
    fetch(`${BASE_URL}/types`)
    .then(resp => resp.json())
    .then(types => {
        types.forEach(type => new Type(type))
        renderTypes()
    })
}

const renderTypes = () => {
    Type.all.forEach(type => type.template())
}

const getAreas = () => {
    fetch(`${BASE_URL}/areas`)
    .then(resp => resp.json())
    .then(areas => {
        areas.forEach(area => new Area(area))
        renderAreas()
    })
}

const renderAreas = () => {
    Area.all.forEach(area => area.template())
}

const getData = (e) => {
    e.preventDefault()
    const typeId = document.querySelector("#types").value 
    const areaId = document.querySelector("#areas").value 
    fetch(`${TRIPS_URL}/${areaId}/${typeId}`)
    .then((res) => res.json())
    .then((trips) => loadTrips(trips))
}

const loadTrips = (trips) => {
    Trip.all = []
    trips.forEach(trip => new Trip(trip))
    renderTrips()
}

const renderTrips = () => {
    const main = document.querySelector(".main")
    main.innerHTML = ""
    Trip.all.forEach(trip => trip.template())
} 

const addTrip = (e) => {
    e.preventDefault()
    const attractionsElements = document.querySelectorAll(".attraction")
    let attractionsValues = []
    attractionsElements.forEach(element => { attractionsValues.push(element.value)})

    const hotelsElements = document.querySelectorAll(".hotel")
    let hotelsValues = []
    hotelsElements.forEach(element => { hotelsValues.push(element.value)})

    const configObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ area_id: e.target.area.value,
                               type_id: e.target.type.value,
                               city: e.target.city.value,
                               country: e.target.country.value,
                               attractions: attractionsValues,
                               hotels: hotelsValues                                      
                            })
    }
    fetch(TRIPS_URL, configObject)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        clearForm()
        if (!data.error) {
            document.querySelector(".alert").style.display = "block"
            setTimeout(function(){ document.querySelector(".alert").style.display = "none"; }, 4000);
        } else {
            document.querySelector(".error-alert").style.display = "block"
            setTimeout(function(){ document.querySelector(".error-alert").style.display = "none"; }, 4000);
        }
    })
}

const deleteTrip = (e) => {
    const configObject = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    }
    fetch(`${TRIPS_URL}/${e.target.dataset.tripId}`, configObject)
    e.target.parentElement.remove()
}

const clearForm = () => {
    document.querySelector("#city").value = ""
    document.querySelector("#country").value = ""
    const attractionsElements = document.querySelector("#attractions")
    attractionsElements.innerHTML = `<label for="attraction">Attractions</label><br>
    <input type="text" name="attraction" id="attraction" class="form-control attraction"><br>`
    const hotelsElements = document.querySelector("#hotels")
    hotelsElements.innerHTML = `<label for="hotel">Hotels</label><br>
    <input type="text" name="hotel" id="hotel" class="form-control hotel"><br>`
}

document.getElementById("main-form").addEventListener("submit", getData)
document.getElementById("trip-form").addEventListener("submit", addTrip)