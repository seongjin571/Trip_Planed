
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
                document.querySelector('body').style.overflow = 'hidden';
                this.day = e.parentNode.dataset.day - 1;
                const dayWrap = document.querySelector('.day');
                planAddBtn.dataset.day = this.day + 1;
                dayWrap.innerHTML = this.day + 1;
            }.bind(this));
        }.bind(this));

        const addPlanContainer = document.querySelector('.add-plan-container');
        addPlanContainer.addEventListener('click', function (e) {
            console.log(e.target);
            if (e.target.className === 'add-plan-verti-div' || e.target.className === 'add-plan-container')
                this.closeModal();
        }.bind(this));

        const tourInfoContainer = document.querySelector('.tour-info-container');
        tourInfoContainer.addEventListener('click', function (e) {
            console.log(e.target);
            if (e.target.className === 'tour-info-verti-div' || e.target.className === 'tour-info-container')
                this.closeModal();
        }.bind(this));

        planAddBtn.addEventListener('click', function (e) {
            this.setTimeInput(0);
            const planDayWrap = document.getElementsByClassName('plan-day-wrap')[this.day];
            const addPlanDiv = document.getElementsByClassName('add-plan')[this.day];
            const templateHtml = document.querySelector('.template-direct').innerHTML;
            const planTitle = document.querySelector('.plan-title').innerHTML;
            const newTemplateHtml = templateHtml.replace('{startTime}', this.startTime.value)
                .replace('{finishTime}', this.finishTime.value)
                .replace('{planContent}', this.planContent.value)
                .replace(/{day}/gi, this.day);
            planDayWrap.removeChild(addPlanDiv);
            planDayWrap.innerHTML += newTemplateHtml;
            planDayWrap.appendChild(addPlanDiv);
            this.enrollDeleteBtn();
            this.closeModal();
        }.bind(this));

        const addTourBtn = document.querySelector('.add-tour-plan-btn');
        addTourBtn.addEventListener('click', function (e) {
            this.setTimeInput(1);
            this.day = document.querySelector('#select-day').value - 1;
            const tourName = document.querySelector('.tour-name').innerHTML;
            const addPlanDiv = document.getElementsByClassName('add-plan')[this.day];
            const planDayWrap = document.getElementsByClassName('plan-day-wrap')[this.day];
            const templateHtml = document.querySelector('.template-tour').innerHTML;
            const newTemplateHtml = templateHtml.replace('{startTime}', this.startTime.value)
                .replace('{finishTime}', this.finishTime.value)
                .replace('{planContent}', tourName)
                .replace(/{day}/gi, this.day);
            planDayWrap.removeChild(addPlanDiv);
            planDayWrap.innerHTML += newTemplateHtml;
            planDayWrap.appendChild(addPlanDiv);
            this.enrollDeleteBtn();
            this.closeModal();

        }.bind(this))
    },

    setTimeInput: function (index) {
        this.startTime = document.getElementsByClassName('input-start-time')[index];
        this.finishTime = document.getElementsByClassName('input-finish-time')[index];
    },

    closeModal: function () {
        document.querySelector('.add-plan-container').style.display = 'none';
        document.querySelector('.tour-info-container').style.display = 'none';
        document.querySelector('body').style.overflow = 'unset';
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
    }
}
const planFun = new addPlan();

const storePlanBtn = document.querySelector('.store-plan-btn');
storePlanBtn.addEventListener('click', function () {
    addPlanHttp = new XMLHttpRequest();
    addPlanHttp.addEventListener("load", function (result) {
        const data = JSON.parse(addPlanHttp.responseText);
        if(data.result === 'success') alert("등록되었습니다.");
    });

    const planCount = document.querySelectorAll('.one-plan');
    let data = [];

    for(let i = 0; i < planCount.length; i++){
        data[i] = {
            start_time: document.getElementsByClassName('start-time')[i].value,
            finish_time: document.getElementsByClassName('finish-time')[i].value,
            plan_content: document.getElementsByClassName('plan-content')[i].value,
            day: document.getElementsByClassName('one-plan')[i].parentElement.parentElement.dataset.day,
            plan_title: document.querySelector('.plan-title').innerHTML,
            tour_flag: 0,
            member_id: 'seongjin571',
            total_day: document.querySelector('.plan-title').dataset.totalday
        }
    }
    addPlanHttp.open("POST", "/addPlan");
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
        console.log(data);
        tourData = data;
        newTourHTML += templateHtml.replace('{tourId}', data.contentid)
            .replace(/{typeId}/gi, data.contenttypeid)
            .replace('{tourImg}', data.firstimage)
            .replace('{tourName}', data.title);
        tourUl.innerHTML = newTourHTML;
    });
    const tourList = document.querySelectorAll('.tour-dest-list');
    tourList.forEach(function (e) {
        e.addEventListener('click', function () {
            $.ajax({
                url: "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&contentId=" + e.dataset.id + "&defaultYN=Y&addrinfoYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTest",
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
            document.querySelector('.tour-info-container').style.display = "block";
        })
    });
}
