const typeImg = "<img src='/images/tour{typeId}.png' class='type-img'>";
const planList = document.querySelectorAll('.plan-list');
planList.forEach(function (e) {
    e.addEventListener('click', function (v) {
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
        const url = "/getPlan?planId=" + planId;
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
    })
})

const detailPlanContainer = document.querySelector('.detail-plan-container');
detailPlanContainer.addEventListener('click', function (e) {
    if (e.target.className === 'detail-plan-verti-div')
        this.style.display = 'none';
});
