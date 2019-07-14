
        const selectLoction = document.querySelector('.select-location');
        selectLoction.addEventListener('change', function () {
            document.querySelector('.big-location').value = this.options[this.selectedIndex].text;
            const url = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode?ServiceKey=RjJLwUTtegMNM%2Barsc%2BPwTW3xU4RZiJFAelIy54Z6sGrJuW36IQthQdAOLg1ZhdXbDD6H1EiuBs2IiOpL3umlQ%3D%3D&areaCode=" + this.value + "&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest";
            $.ajax({
                url: url,
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    const smallLocation = document.querySelector('.select-small-location');
                    smallLocation.innerHTML = "";
                    smallLocation.innerHTML = "<option>선택하세요</option>";
                    $.each(result.response.body.items.item, function (i, d) {
                        smallLocation.innerHTML += '<option value =' + d.code + ">" + d.name + "</option>";
                    });
                }
            });
        })


        function calDay() {
            const startDay = document.getElementsByClassName("day-input")[0].value;
            const finishDay = document.getElementsByClassName("day-input")[1].value;
            const ar1 = startDay.split('-');
            const ar2 = finishDay.split('-');
            const da1 = new Date(ar1[0], ar1[1], ar1[2]);
            const da2 = new Date(ar2[0], ar2[1], ar2[2]);
            const dif = da2 - da1;
            const cDay = 24 * 60 * 60 * 1000;
            const cMonth = cDay * 30;
            const cYear = cMonth * 12;
            if (startDay && finishDay) {
                return parseInt(dif / cDay) + 1;
            }
        }

        let today = new Date();
        let date = new Date();
        function prevCalendar() {
            today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            buildCalendar(0);
        }
        function nextCalendar() {
            today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            buildCalendar(1);
        }
        let yearWrap;
        let monthWrap;

        function buildCalendar(index) {
            const doMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            const tbCalendar = document.querySelector(".calendar");
            const tbCalendarYM = document.querySelector(".tbCalendarYM");
            yearWrap = document.querySelector('.year');
            monthWrap = document.querySelector('.month');
            yearWrap.innerHTML = today.getFullYear();
            monthWrap.innerHTML = (today.getMonth() + 1);

            while (tbCalendar.rows.length > 2) {
                tbCalendar.deleteRow(tbCalendar.rows.length - 1);
            }
            let row = tbCalendar.insertRow();
            row.className = 'row-day';
            let count = 0;
            for (i = 0; i < doMonth.getDay(); i++) {
                cell = row.insertCell();
                count = count + 1;
            }
            for (i = 1; i <= lastDate.getDate(); i++) {
                cell = row.insertCell();
                cell.innerHTML = i;
                count = count + 1;
                if (count % 7 == 1) {
                    cell.className = "sunday";

                }
                if (count % 7 == 0) {
                    cell.className = "saturday";
                    row = tbCalendar.insertRow();
                    row.className = 'row-day';
                }
                if (today.getFullYear() == date.getFullYear()
                    && today.getMonth() == date.getMonth()
                    && i == date.getDate()) {
                    cell.bgColor = "#FAF58C";
                }
            }

            const day = document.querySelectorAll('.row-day>td');
            const calendarContainer = document.querySelector('.calendar-container');
            day.forEach(function (v) {
                v.addEventListener('click', function (c) {
                    const dateInput = document.getElementsByClassName('day-input')[index];
                    dateInput.value = yearWrap.innerHTML + '-' + monthWrap.innerHTML + '-' + c.target.innerHTML;
                    calendarContainer.style.display = 'none';
                    const totalDay = calDay();
                    if (totalDay < 1) {
                        alert('날짜를 다시 선택해 주세요');
                        cancelCheck(2);
                        cancelCheck(3);
                        document.getElementsByClassName('day-input')[0].value = "";
                        document.getElementsByClassName('day-input')[1].value = "";
                    }
                    else {
                        document.querySelector('.total-day').value = totalDay;
                        calendarContainer.style.display = 'none';
                        doCheck(Number(index) + 2);
                    }
                })
            })
        }

        doCheck = function (index) {
            document.getElementsByClassName('check-img')[index].style.display = 'inline';
            document.getElementsByClassName('nocheck-img')[index].style.display = 'none';
            this.count++;
        }

        cancelCheck = function (index) {
            document.getElementsByClassName('check-img')[index].style.display = 'none';
            document.getElementsByClassName('nocheck-img')[index].style.display = 'inline';
            if (this.count > 0) this.count--;
        }

        function makePlan() {
            this.count = 0;
            this.selectDayBtn = document.querySelectorAll('.select-day-button');
            this.calendarContainer = document.querySelector('.calendar-container');
            this.planTitle = document.querySelector('.plan-title');
            this.selectLoction = document.querySelector('.select-small-location');
            this.enrollEvent();
        }

        makePlan.prototype = {
            enrollEvent: function () {
                this.planTitle.addEventListener('change', function () {
                    if (this.planTitle.value !== '')
                        doCheck(0);
                    else
                        cancelCheck(0);
                }.bind(this));

                this.calendarContainer.addEventListener('click', function (e) {
                    if (e.target.className === 'calendar-verti-div')
                        this.style.display = 'none';
                })

                this.selectDayBtn.forEach(function (e) {
                    e.addEventListener('click', function () {
                        document.querySelector('.calendar-container').style.display = 'block';
                        buildCalendar(e.dataset.count);
                    }.bind(this))
                }.bind(this));

                this.selectLoction.addEventListener('change', function (e) {
                    document.querySelector('.small-location').value = this.selectLoction[this.selectLoction.selectedIndex].text;
                    if (this.selectLoction.value > 0) doCheck(1);
                    else cancelCheck(1);
                }.bind(this));
            },
        }

        const makePlanFun = new makePlan();