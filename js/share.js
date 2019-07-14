const typeImg = "<img src='/images/tour{typeId}.png' class='type-img'>";
let smallCity;
let bigCityVal = 0;
const moreBtn = document.querySelector('.more-btn');
let flag = false;
let sharePlanUl = document.querySelector('.share-plan-ul');
const smallLocation = document.querySelector('.select-small-location');
const templatePlanHtml = document.querySelector('.template-one-plan').innerHTML;
function getAllPlan(order, count) {
    let url = '/api/getAllLocation?order=' + order + "&count=" + count;
    const shareHttp = new XMLHttpRequest();
    shareHttp.addEventListener("load", function (result) {
        const data = JSON.parse(shareHttp.responseText);
        moreBtn.dataset.length = data.length[0].length;
        let newTemplateHtml = "";

        if (moreBtn.dataset.count >= data.length[0].length)
            moreBtn.style.display = 'none';
        else {
            moreBtn.style.display = 'block';
        }
        data.result.forEach(function (e) {
            newTemplateHtml += templatePlanHtml.replace('{planId}', e.plan_id)
                .replace('{startDay}', e.start_day)
                .replace('{finishDay}', e.finish_day)
                .replace('{planTitle}', e.plan_title)
                .replace('{good}', e.good)
                .replace('{bigCity}', e.big_city)
                .replace('{smallCity}', e.small_city)
                .replace('{totalDay}', e.total_day);
        })
        if (!flag) sharePlanUl.innerHTML = newTemplateHtml;
        else sharePlanUl.innerHTML += newTemplateHtml;
        flag = false;
        const planList = document.querySelectorAll('.plan-list');
        planList.forEach(function (e,i) {
            e.addEventListener('click', function (v) {
                if (!v.target.classList.contains('heart-wrap') && !v.target.classList.contains('heart')) {
                    getPlanInfo(e, v);
                } else {
                    console.log(i)
                    execGoodLogic(e,i);
                }   
            });
        });
    });
    shareHttp.open('get', url);
    shareHttp.send();
}
getAllPlan(document.querySelector('.standard').dataset.name, 0);

const selectLoction = document.querySelector('.select-location');
selectLoction.addEventListener('change', function () {
    if (Number(this.value) === 0) {
        flag = false;
        const order = document.querySelector('.standard').dataset.name;
        smallLocation.innerHTML = "<option>선택하세요</option>";
        moreBtn.dataset.count = 6;
        getAllPlan(order, 0);
    }
    else {
        flag = false;
        url = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&areaCode=" + this.value + "&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest";
        $.ajax({
            url: url,
            dataType: "json",
            success: function (result) {
                moreBtn.dataset.count = 6;
                smallLocation.innerHTML = "";
                smallLocation.innerHTML = "<option>선택하세요</option>";
                $.each(result.response.body.items.item, function (i, d) {
                    smallLocation.innerHTML += '<option value =' + d.code + ">" + d.name + "</option>";
                });
            }
        });
    }
})

function getOneLocation(smallCity, order, count) {
    url = '/api/getOneLocation?smallCity=' + smallCity + "&order=" + order + "&count=" + count;
    const smallCityHttp = new XMLHttpRequest();
    smallCityHttp.addEventListener("load", function (result) {
        const data = JSON.parse(smallCityHttp.responseText);
        if (data.result.length === 0) {
            alert('해당 지역에 계획이 없습니다.');
            location.reload();
        } else {
            if (data.length <= 6)
                moreBtn.style.display = 'none';
            if (data.length[0].length > 6) {
                moreBtn.style.display = 'block';
            } else {
                moreBtn.style.display = 'none';
            }
            moreBtn.dataset.length = data.length[0].length;
            let newTemplateHtml = "";
            data.result.forEach(function (e) {
                newTemplateHtml += templatePlanHtml.replace('{planId}', e.plan_id)
                    .replace('{startDay}', e.start_day)
                    .replace('{finishDay}', e.finish_day)
                    .replace('{bigCity}', e.big_city)
                    .replace('{planTitle}', e.plan_title)
                    .replace('{good}', e.good)
                    .replace('{smallCity}', e.small_city)
                    .replace('{totalDay}', e.total_day);
            })
            if (!flag) sharePlanUl.innerHTML = newTemplateHtml;
            else sharePlanUl.innerHTML += newTemplateHtml;
            flag = false;
            moreBtn.dataset.count = 6;
        }
        const planList = document.querySelectorAll('.plan-list');
        planList.forEach(function (e,i) {
            e.addEventListener('click', function (v) {
                if (!v.target.classList.contains('heart-wrap') && !v.target.classList.contains('heart')) {
                    getPlanInfo(e, v);
                } else {
                    console.log(i)
                    execGoodLogic(e,i);
                }   
            });
        });
    });
    smallCityHttp.open('get', url);
    smallCityHttp.send();

}

smallLocation.addEventListener('change', function (e) {
    const order = document.querySelector('.standard').dataset.name;
    smallCity = this.options[this.selectedIndex].text;
    flag = false;
    getOneLocation(smallCity, order, 0);
});

const optionList = document.querySelectorAll('.option-list');
optionList.forEach(function (e) {
    e.addEventListener('click', function () {
        optionList.forEach(function (v) {
            v.classList.remove('standard');
        })
        e.classList.add('standard');
        const order = e.dataset.name;
        if (Number(selectLoction.value) === 0) {
            moreBtn.dataset.count = 6;
            smallLocation.innerHTML = "<option>선택하세요</option>";
            flag = false;
            getAllPlan(order, 0);
        }
        else {
            moreBtn.dataset.count = 6;
            smallCity = smallLocation.options[smallLocation.selectedIndex].text;
            flag = false;
            getOneLocation(smallCity, order, 0);

        }
    })
})
moreBtn.addEventListener('click', function (e) {
    const currCount = Number(this.dataset.count);
    const order = document.querySelector('.standard').dataset.name;
    if (Number(selectLoction.value) === 0) {
        flag = true;
        smallLocation.innerHTML = "<option>선택하세요</option>";
        getAllPlan(order, currCount);
        this.dataset.count = currCount + 6;

    }
    else {
        flag = true;
        getOneLocation(smallCity, order, currCount);
        this.dataset.count = currCount + 6;
    }
})


function getPlanInfo(e, v) {
    const planContainer = document.querySelector('.plan-container');
    planContainer.innerHTML = "";
    document.querySelector('.detail-plan-container').style.display = "block";
    const planId = e.dataset.planid;
    const totalDay = e.dataset.totalday;
    const templateHtml = document.querySelector('.template-day').innerHTML;
    for (let i = 0; i < totalDay; i++) {
        const newTemplateHtml = templateHtml.replace('{day}', i + 1);
        planContainer.innerHTML += newTemplateHtml;
    }
    const url = "/api/getPlan?planId=" + planId;
    planHttp = new XMLHttpRequest();
    planHttp.addEventListener("load", function (result) {
        const data = JSON.parse(planHttp.responseText);
        data.result.forEach(function (e) {
            console.log(e);
            const dayWrap = document.getElementsByClassName('plan-day-wrap')[e.day - 1];
            let onePlan = document.querySelector('.template-tour').innerHTML;
            let newTemplateHtml = onePlan.replace('{startTime}', e.start_time)
                .replace('{finishTime}', e.finish_time)
                .replace('{planContent}', e.plan_content);
            if (e.tour_flag !== 0) {
                newTemplateHtml = newTemplateHtml.replace('<span></span>', typeImg)
                    .replace('{typeId}', e.tour_flag)
            }
            dayWrap.innerHTML += newTemplateHtml;
        })
    })
    planHttp.open("GET", url);
    planHttp.send();
}
const detailPlanContainer = document.querySelector('.detail-plan-container');
detailPlanContainer.addEventListener('click', function (e) {
    if (e.target.className === 'detail-plan-verti-div')
        this.style.display = 'none';
});

function execGoodLogic(e,i) {
    var user_name = document.getElementById("user_name").innerHTML;
    var plan_Id = e.dataset.planid;
    const data = {
        user_name: user_name,
        plan_Id: plan_Id
    }
    $.ajax({
        type: "post",
        url: "/api/like_table",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        datatype: "json",
        data: data,
        success: function (result) {

            if (result.result == 'count1') {
                const goodCount = Number(e.lastElementChild.lastElementChild.lastElementChild.innerHTML);
                e.lastElementChild.lastElementChild.lastElementChild.innerHTML = goodCount + 1;
                console.log('여기까지 들어옴')
                document.getElementsByClassName('heart-img heart')[i].style.display = "inline";
                document.getElementsByClassName('noheart-img heart')[i].style.display = "none";

            } else {
                const goodCount = Number(e.lastElementChild.lastElementChild.lastElementChild.innerHTML);
                e.lastElementChild.lastElementChild.lastElementChild.innerHTML = goodCount - 1;
                document.getElementsByClassName('heart-img heart')[i].style.display = "none";
                document.getElementsByClassName('noheart-img heart')[i].style.display = "inline";
            }
        },
        error: function (error) {
            alert("error");
        }
    });
}