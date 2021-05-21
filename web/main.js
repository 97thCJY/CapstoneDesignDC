// kw당 가격 (원)
var price_per_kw = 100;

// 원격 제어
window.onload = function() {
    var myModal = document.getElementById('plus_btn');
    var myInput = document.getElementById('PlusModal');

    myModal.addEventListener('shown.bs.modal', function() {
        myInput.focus();
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
    const latitude = position.coords.latitude; // 경도
    const longitude = position.coords.longitude; // 위도
    getWeather(latitude, longitude);
}

function handleGeoErr(err) {
    console.log("geo err! " + err);
    getWeather(37.5665, 126.9780); // 서울 기준으로 호출
}
// 위치정보 요청
function requestCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucc, handleGeoErr);
}
requestCoords();


// 로그아웃
function requestRemoteLogout() {
    alert("서버에서 User 로그아웃필요.");
}


/* remote 페이지 */
// 원격 기기 on/off 요청
function requestRemoteOnOff(product_id) {
    alert("Product Id값 " + product_id + "번 on/off 요청");
    document.getElementsByClassName("card_round").style.border = '5px solid red';
}

// 원격 기기 추가 요청
function requestRemoteSave() {
    var name = document.getElementById("new_name").value;
    var port = document.getElementById("new_port").value;

    if (name === "" || port === "") {
        alert("이름과 포트번호를 입력해주세요.")
    } else {
        alert("새 기기 추가 요청\n이름: " + name + "\n포트: " + port);
    }
}


/* deal 페이지 */
// 전력 판매글 추가 요청
function addDeal() {
    var amount = document.getElementById("transaction_amount").value;
    var description = document.getElementById("transaction_description").value;
    var price = amount * price_per_kw

    if (amount < 1) {
        alert("판매량은 1보다 커야합니다.");
        return;
    }

    var input_confirm = confirm("판매글을 추가하시겠습니까?\n판매량: " +
        amount + "kw (" + price + "원)\n내용: " + description);

    if (input_confirm) {
        alert("새 판매글 추가 요청\n판매량: " + amount + "kw\n내용: " + description);
    } else {
        alert("취소되었습니다.");
    }
}

// 판매량 입력에 따른 예상 가격 계산
function calculatePrice() {
    var amount = document.getElementById("transaction_amount").value;
    document.getElementById("transaction_price").value = amount * price_per_kw + "원";
}


/* Setting Modal 창*/
var portid;

function requestRemoteSetting(name, port, id) {
    portid = id;
    document.getElementById("SettingModalLabel").innerText = name;
    if (name == "태양열 전지") {
        document.getElementById("now_name").value = name;
        document.getElementById("now_name").readOnly = true;
    } else {
        document.getElementById("now_name").value = name;
        document.getElementById("now_name").readOnly = false;
    }
    document.getElementById("now_port").value = port;

}

// 수정 요청
function requestRemoteFix() {
    var name = document.getElementById("now_name").value;
    var port = document.getElementById("now_port").value;


    if (name === "" || port === "") {
        alert("이름과 포트번호를 입력해주세요.")
    } else {
        alert("변경 내용 수정 요청\nID: " + portid + "\n이름: " + name + "\n포트: " + port);
    }
}
// 실시간 거래 확인 페이지
function progress_change() {
    var current_progress = 0;
    var progress = document.getElementById("dynamic");
    var interval = setInterval(function() {
        current_progress += 10;
        progress.style.width = current_progress + '%';
        progress.setAttribute("aria-valuenow", current_progress)
        progress.textContent = current_progress + '%';
        /*$("#dynamic")
            .css("width", current_progress + "%")
            .attr("aria-valuenow", current_progress)
            .text(current_progress + "% Complete");*/
        if (current_progress >= 100) {
            clearInterval(interval);
        }
    }, 1000);
}