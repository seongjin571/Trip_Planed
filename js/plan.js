
function addPlan() {
    this.startTime = null;
    this.finishTime = null;
    this.planContent = document.querySelector('.input-plan-content');
    this.newTemplateHtml = "";
    this.day = 0;
    this.enrollEvent();
}

addPlan.prototype = {
    enrollEvent: function () {
        const planAddBtn = document.querySelector('.add-plan-btn');
        const addDirBtn = document.querySelectorAll('.add-direct');
        addDirBtn.forEach(function (e) {
            e.addEventListener('click', function (v) {
                document.querySelector('.add-plan-container').style.display = 'block';
                document.querySelector('html').style.overflow = 'hidden';
                this.day = e.parentNode.dataset.day - 1;
                const dayWrap = document.querySelector('.day');
                planAddBtn.dataset.day = this.day + 1;
                dayWrap.innerHTML = this.day + 1;
            }.bind(this));
        }.bind(this));

        const addPlanContainer = document.querySelector('.add-plan-container');
        addPlanContainer.addEventListener('click', function (e) {
            if (e.target.className === 'add-plan-verti-div' || e.target.className === 'add-plan-container')
                this.closeModal();
        }.bind(this));

        const tourInfoContainer = document.querySelector('.tour-info-container');
        tourInfoContainer.addEventListener('click', function (e) {
            if (e.target.className === 'tour-info-verti-div' || e.target.className === 'tour-info-container')
                this.closeModal();
        }.bind(this));

        planAddBtn.addEventListener('click', function (e) {
            this.setTimeInput(0);
            const planDayWrap = document.getElementsByClassName('plan-day-wrap')[this.day];
            const templateHtml = document.querySelector('.template-direct').innerHTML;
            const newTemplateHtml = templateHtml.replace('{startTime}', this.startTime.value)
                .replace('{finishTime}', this.finishTime.value)
                .replace('{planContent}', this.planContent.value)
                .replace(/{day}/gi, this.day)
            this.insertPlanLogic(planDayWrap, newTemplateHtml);
            this.enrollDeleteBtn();
            this.closeModal();
        }.bind(this));

        const addTourBtn = document.querySelector('.add-tour-plan-btn');
        addTourBtn.addEventListener('click', function (e) {
            this.setTimeInput(1);
            this.day = document.querySelector('.select-day').value - 1;
            const tourName = document.querySelector('.tour-name');
            const planDayWrap = document.getElementsByClassName('plan-day-wrap')[this.day];
            const templateHtml = document.querySelector('.template-tour').innerHTML;
            const newTemplateHtml = templateHtml.replace('{startTime}', this.startTime.value)
                .replace('{finishTime}', this.finishTime.value)
                .replace('{planContent}', tourName.innerHTML)
                .replace('{tourId}', tourName.dataset.id)
                .replace('{tourImg}', tourName.dataset.img)
                .replace('{mapx}', tourName.dataset.mapx)
                .replace('{mapy}', tourName.dataset.mapy)
                .replace(/{typeId}/gi, tourName.dataset.typeid)
                .replace(/{day}/gi, this.day);
            this.insertPlanLogic(planDayWrap, newTemplateHtml)
            this.enrollDeleteBtn();
            this.closeModal();

            const tourLink = document.querySelectorAll('.tour-link');
            tourLink.forEach(function (tour) {
                tour.addEventListener('click', function (data) {
                    document.querySelector('.only-tour-info-container').style.display = "block";
                    document.querySelector('html').style.overflow = 'hidden';

                    const tourName = document.querySelector('.tour-name2');
                    $.ajax({
                        url: "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&contentId=" + tour.dataset.id + "&defaultYN=Y&addrinfoYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTest",
                        dataType: "json",
                        success: function (result) {
                            document.querySelector('.only-tour-img').style.backgroundImage = "url('" + tour.dataset.tourImg + "')";
                            tourName.innerHTML = result.response.body.items.item.title;
                            document.querySelector('.overview2').innerHTML = result.response.body.items.item.overview;
                            document.querySelector('.address2').innerHTML = result.response.body.items.item.addr1;
                            document.querySelector('.tel2').innerHTML = result.response.body.items.item.tel;
                            document.querySelector('.homepage2').innerHTML = result.response.body.items.item.homepage;
                            drawMap(tour.dataset.mapy, tour.dataset.mapx, 1);
                        }
                    });
                })
            });
        }.bind(this))
    },

    setTimeInput: function (index) {
        this.startTime = document.getElementsByClassName('input-start-time')[index];
        this.finishTime = document.getElementsByClassName('input-finish-time')[index];
    },

    closeModal: function () {
        document.querySelector('.add-plan-container').style.display = 'none';
        document.querySelector('.tour-info-container').style.display = 'none';
        document.querySelector('html').style.overflow = 'unset';
        this.startTime.value = "";
        this.finishTime.value = "";
        this.planContent.value = "";
    },

    enrollDeleteBtn: function () {
        const deleteBtn = document.querySelectorAll('.one-plan > span');
        deleteBtn.forEach(function (e) {
            e.addEventListener('click', function (v) {
                const onePlanParent = document.getElementsByClassName('plan-day-wrap')[v.target.dataset.day];
                onePlanParent.removeChild(v.target.parentNode);
            })
        })
    },
    
    insertPlanLogic: function(planDayWrap, newTemplateHtml){
        let length = planDayWrap.children.length;
        if (length === 1) {
            $('.add-plan').eq(this.day).before(newTemplateHtml);
        } else {
            for (let i = 0; i < length - 1; i++) {
                let startTime = planDayWrap.children[i].firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.value;
                let finishTime = planDayWrap.children[i].firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.value;
                if (this.startTime.value < startTime) {
                    if (this.finishTime.value <= startTime) {
                        $(newTemplateHtml).insertBefore($('.plan-day-wrap').eq(this.day).children()[i]);
                        break;
                    }else{
                        alert("시간을 잘못 입력하셨습니다");
                        break;
                    }
                }else if(this.startTime.value == startTime){
                    alert("시간을 잘못 입력하셨습니다");
                    break;
                }else{
                    if(this.finishTime.value < finishTime){
                        alert("시간을 잘못 입력하셨습니다");
                        break;
                    }
                    if(i === length - 2){
                        $('.add-plan').eq(this.day).before(newTemplateHtml);
                    } 
                }
            }
        }
    }
}
const planFun = new addPlan();


const onlyTourInfoContainer = document.querySelector('.only-tour-info-container');
onlyTourInfoContainer.addEventListener('click', function (e) {
    if (e.target.className === 'tour-info-verti-div' || e.target.className === 'only-tour-info-container') {
        document.querySelector('.only-tour-info-container').style.display = 'none';
        document.querySelector('html').style.overflow = 'unset';
    }
});
const storePlanBtn = document.querySelector('.store-plan-btn');
storePlanBtn.addEventListener('click', function () {
    addPlanHttp = new XMLHttpRequest();
    addPlanHttp.addEventListener("load", function (result) {
        const data = JSON.parse(addPlanHttp.responseText);
        if (data.result === 'success') {alert("등록되었습니다.");
        window.location.href='/users/mypage';
    }
    });

    const planCount = document.querySelectorAll('.one-plan');
    let data = [];
    const planTitle = document.querySelector('.plan-title');
    console.log(planTitle.innerHTML);
    for (let i = 0; i < planCount.length; i++) {
        let typeId = document.getElementsByClassName('one-plan')[i].dataset.typeId
        data[i] = {
            start_time: document.getElementsByClassName('start-time')[i].value,
            finish_time: document.getElementsByClassName('finish-time')[i].value,
            plan_content: document.getElementsByClassName('plan-content')[i].value,
            day: document.getElementsByClassName('one-plan')[i].parentElement.parentElement.dataset.day,
            plan_title: planTitle.innerHTML,
            tour_flag: typeId,
            member_id: planTitle.dataset.id,
            total_day: planTitle.dataset.totalDay,
            start_day: planTitle.dataset.startDay,
            finish_day: planTitle.dataset.finishDay,
            big_city: document.querySelector('.big-city').innerHTML,
            small_city: document.querySelector('.small-city').innerHTML,

        }
    }
    addPlanHttp.open("POST", "/api/addPlan");
    addPlanHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    addPlanHttp.send(JSON.stringify(data));
})

const selTourType = document.querySelector('.tour-type');
const bigLocation = selTourType.dataset.big;
const smallLocation = selTourType.dataset.small;
const tourUl = document.querySelector('.tour-dest-ul');
const templateHtml = document.querySelector('.template-tour-list').innerHTML;
$.ajax({
    url: "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&areaCode=" + bigLocation + "&sigunguCode=" + smallLocation + "&numOfRows=100&MobileOS=ETC&MobileApp=AppTest",
    dataType: "json",
    success: function (result) {
        addTourList(result);
    }
});

selTourType.addEventListener('change', function () {
    tourUl.innerHTML = "";
    $.ajax({
        url: "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&areaCode=" + bigLocation + "&sigunguCode=" + smallLocation + "&contentTypeId=" + this.value + "&numOfRows=100&MobileOS=ETC&MobileApp=AppTest",
        dataType: "json",
        success: function (result) {
            addTourList(result);
        }
    });
})
function addTourList(result) {
    let newTourHTML = '';
    let tourData;
    $.each(result.response.body.items.item, function (i, data) {
        tourData = data;
        newTourHTML += templateHtml.replace('{tourId}', data.contentid)
            .replace(/{typeId}/gi, data.contenttypeid)
            .replace('{tourImg}', data.firstimage)
            .replace('{tourName}', data.title)
            .replace('{mapX}', data.mapx)
            .replace('{mapY}', data.mapy)
        tourUl.innerHTML = newTourHTML;
    });
    const tourList = document.querySelectorAll('.tour-dest-list');
    tourList.forEach(function (e) {
        e.addEventListener('click', function () {
            const tourName = document.querySelector('.tour-name');
            $.ajax({
                url: "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&contentId=" + e.dataset.id + "&defaultYN=Y&addrinfoYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTest",
                dataType: "json",
                success: function (result) {
                    document.querySelector('.tour-img').style.backgroundImage = "url('" + e.firstElementChild.src + "')";
                    tourName.innerHTML = result.response.body.items.item.title;
                    tourName.dataset.id = e.dataset.id;
                    tourName.dataset.img = e.firstElementChild.src;
                    tourName.dataset.mapx = e.dataset.mapx;
                    tourName.dataset.mapy = e.dataset.mapy;
                    tourName.dataset.typeid = e.dataset.typeId;
                    document.querySelector('.overview').innerHTML = result.response.body.items.item.overview;
                    document.querySelector('.address').innerHTML = result.response.body.items.item.addr1;
                    document.querySelector('.tel').innerHTML = result.response.body.items.item.tel;
                    document.querySelector('.homepage').innerHTML = result.response.body.items.item.homepage;
                    drawMap(e.dataset.mapy, e.dataset.mapx, 0);
                }
            });
            document.querySelector('.tour-info-container').style.display = "block";
            document.querySelector('html').style.overflow = 'hidden';
        })
    });
}

function drawMap(mapX, mapY, index) {
    var container = document.getElementsByClassName('map')[index];
    var options = {
        center: new kakao.maps.LatLng(mapX, mapY),
        level: 4
    };

    var map = new kakao.maps.Map(container, options);

    var position = {
        title: "title",
        latlng: new kakao.maps.LatLng(mapX, mapY)
    };

    var markers = new kakao.maps.Marker({
        map: map,
        position: position.latlng,
        title: position.title
    });
}

var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
    document.querySelector('html').style.overflow = 'hidden';
}
span.onclick = function () {
    modal.style.display = "none";
    document.querySelector('html').style.overflow = 'unset';
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.querySelector('html').style.overflow = 'unset';
    }
}
var input = document.querySelector(".big-city").innerHTML;
var txt = document.getElementsByClassName("weather-ul")[0];
txt.innerHTML = "";
$.ajax({
    url: 'http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=108',
    dataType: 'xml',
    success: function (response) {
        $(response).find('location').each(function () {
            var city = $(this).find('city').text();
            if (input == '경기도') {
                input = '서울';
            } else if (input == '강원도') {
                input = '춘천';
            }
            else if (input == '충청북도') {
                input = '청주';
            } else if (input == '충청남도') {
                input = '홍성';
            } else if (input == '경상북도') {
                input = '대구';
            } else if (input == '경상남도') {
                input = '부산';
            } else if (input == '전라북도') {
                input = '전주';
            } else if (input == '전라남도') {
                input = '목포';
            } else if (input == '제주도') {
                input = '서귀포';
            }
            if (city == input) {
                $(this).find('data').each(function () {
                    var output1 = $(this).find('tmEf').text();
                    var output2 = $(this).find('wf').text();
                    output1 = output1.substring(0, 10);
                    var output3 = $(this).find('tmEf').text();
                    output3 = output3.substring(11, 16);
                    if (output3 == '00:00') {
                        var am = '오전';
                        txt.innerHTML += "<li class='weather-list' style='font-size : 20px;'><div class='weather-day'>" + output1 + am + "</div><div class='weather-content'>" + output2 + "</div></li>";
                    }
                    else {
                        var pm = '오후';
                        txt.innerHTML += "<li class='weather-list' style='font-size : 20px;'><div class='weather-day'>" + output1 + pm + "</div><div class='weather-content'>" + output2 + "</div></li>";
                    }
                })
            }
        })
    }
})