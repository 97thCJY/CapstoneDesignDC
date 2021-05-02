// 원격 제어
window.onload = function () {
    var myModal = document.getElementById('plus_btn');
    var myInput = document.getElementById('PlusModal');

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus()
    });
}


// 날씨 함수
function getWeather(lat, lon) {
    let weatherIcon = {
        '01': 'fas fa-sun',
        '02': 'fas fa-cloud-sun',
        '03': 'fas fa-cloud',
        '04': 'fas fa-cloud-meatball',
        '09': 'fas fa-clod-sun-rain',
        '10': 'fas fa-cloud-showers-heavy',
        '11': 'fas fa-poo-storm',
        '13': 'fas fa-snowflake',
        '50': 'fas fa-smog',
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=96c79cd2523ae35399c1d6f3e96c599b&units=metric`)
        .then(res => res.json())
        .then(data => {
            const icon = (data.weather[0].icon).substr(0, 2);
            const temperature = Math.floor(data.main.temp) + '°C';
            const city = data.name;

            document.getElementById("weather").innerHTML =
                '<i class="' + weatherIcon[icon] + '"></i> ' + temperature + '<br>' + city;
        })
}

// 위치정보 함수
function handleGeoSucc(position) {
    const latitude = position.coords.latitude;  // 경도
    const longitude = position.coords.longitude;  // 위도
    getWeather(latitude, longitude);
}
function handleGeoErr(err) {
    console.log("geo err! " + err);
    getWeather(37.5665, 126.9780);  // 서울 기준으로 호출
}
// 위치정보 요청
function requestCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucc, handleGeoErr);
}

requestCoords();


/* remote 페이지 */
// 원격 기기 on/off 요청
function requestRemoteOnOff(product_id) {
    alert("Product Id값 " + product_id + "번 on/off 요청");
}

// 원격 기기 추가 요청
function requestRemoteSave() {
    var name = document.getElementById("new_name").value;
    var port = document.getElementById("new_port").value;

    if (name==="" || port==="") {
        alert("이름과 포트번호를 입력해주세요.")
    }
    else {
        alert("새 기기 추가 요청\n이름: " + name + "\n포트: " + port);
    }
}