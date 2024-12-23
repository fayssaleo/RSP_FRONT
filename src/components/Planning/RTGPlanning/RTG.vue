<template>
  <div class="main">
    <div class="content">
      <!-- <v-btn @click="reset"> Reset </v-btn>  -->
      <RTGPlannings v-if="getPlanningWithTheBoxes == null" :ShiftIndex="ShiftIndex" :NotwaitLoading="NotwaitLoading"
        :setSelectedPlanning="setSelectedPlanning" :plannings="plannings" :attributes="attributes"
        @getCurrentPlanningAndBoxes="getCurrentPlanningAndBoxes" @sendNudes="sendNudes"
        @changeSelectedProfileGroupFrom_Watch="changeSelectedProfileGroupFrom_Watch"
        @showNotificationClassSuccess="showNotificationClassSuccess"
        @showNotificationClassFailed="showNotificationClassFailed" />
      <RTGCreate v-if="
        this.role &&
        this.role.name !== 'driver' &&
        getPlanningWithTheBoxes &&
        getPlanningWithTheBoxes?.planning &&
        getPlanningWithTheBoxes?.planning_boxes == null
      " :actualShift="actualShift" :selectedDate="selectedDate" :selectedPlanning="selectedPlanning"
        :ShiftIndex="ShiftIndex" @createPlanning="createPlanning" @clearPlannings="clearPlannings"
        @showNotificationClassSuccess="showNotificationClassSuccess"
        @showNotificationClassFailed="showNotificationClassFailed" />
      <RTGShow v-if="
        this.role &&
        this.role.name !== 'driver' &&
        getPlanningWithTheBoxes &&
        getPlanningWithTheBoxes?.planning &&
        getPlanningWithTheBoxes?.planning_boxes
      " :actualShift="actualShift" :selectedDate="selectedDate" :selectedPlanning="selectedPlanning"
        :ShiftIndex="ShiftIndex" :tableHeaders="tableHeaders" :checkEditedPlanning="checkEditedPlanning"
        @CustomRtgPlanning="CustomRtgPlanning" @rtgFullPlanning="rtgFullPlanning" @clearPlannings="clearPlannings"
        @showNotificationClassSuccess="showNotificationClassSuccess" @PlanningAlreadyCreated="PlanningAlreadyCreated"
        @showNotificationClassFailed="showNotificationClassFailed" @setPlanningInMasterComp="setPlanningInMasterComp"
        @deleteFromPlanningInFirstPage="deleteFromPlanningInFirstPage" />
    </div>
    <div id="appp">
      <div class="notification-container">
        <div :class="['notification', notificationClassSuccess]" @click="hideNotificationClassSuccess">
          {{ notificationClassSuccessMsg }}
        </div>
      </div>
      <div class="notification-container">
        <div :class="['notification', notificationClassFailed]" @click="hideNotificationClassFailed">
          {{ notificationClassFailedMsg }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import RTGCreate from "./RTGCreate.vue";
export default {
  data() {
    return {
      NotwaitLoading: false,
      selectedProfileGroup: null,
      checkEditedPlanning: [],
      plannings: [],
      PlanningsToSHow: true,
      selectedPlanning: null,
      role: null,
      actualShift: null,
      selectedDate: null,
      driversList: [],
      equipmentList: [],
      ShiftIndex: -1,
      tableHeaders: [],
      arrayToSave: [],
      notificationClassSuccess: "",
      notificationClassFailed: "",
      notificationClassSuccessMsg: "",
      notificationClassFailedMsg: "",
      attributes: [],
      shift_intervals: [],
    };
  },
  computed: {
    ...mapGetters([
      "getPlannings",
      "getUserRole",
      "getPlanningWithTheBoxes",
      "getStorageData",
      'getSelected_profile_group',
      'getProfileGroups',
    ]),
    getShiftPeriode() {
      if (this.ShiftIndex == 0) return "Morning";
      if (this.ShiftIndex == 1) return "Evening";
      if (this.ShiftIndex == 2) return "Night";
    },
  },
  watch: {
    '$route'(to, from) {
      // This function will trigger every time the route changes
      if (this.plannings.length == 0 || !this.getSelected_profile_group || to.name != this.getSelected_profile_group.type) {
        if (to.name === "rtg") {
          this.changeSelectedProfileGroupFrom_Watch(1);
        }
        else if (to.name === "sts") {
          this.changeSelectedProfileGroupFrom_Watch(2);
        }

      }
      else {
        this.getSelected_profile_group = { ...this.getSelected_profile_group };
      }
    }
  },
  created() {
    if ((this.plannings.length == 0 && this.getPlanningWithTheBoxes == null && this.getPlanningWithTheBoxes?.planning == null) || !this.getSelected_profile_group || this.$route.name != this.getSelected_profile_group?.type) {
      if (this.$route.name === "rtg") {
        this.changeSelectedProfileGroupFrom_Watch(1);
      }
      else if (this.$route.name === "sts") {
        this.changeSelectedProfileGroupFrom_Watch(2);
      }

    }

  },
  mounted() {

    this.getCurrentPlanningMethod();
    this.shift_intervals = [
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
      "18:00-19:00",
      "19:00-20:00",
      "20:00-21:00",
      "21:00-22:00",
      "22:00-23:00",
    ];
    //this.changeSelectedProfileGroupFrom_Watch(1);
  },
  methods: {
    ...mapActions([
      "clearPlannings",
      "createPlanningAction",
      "setLoadingValueAction",
      "setPlanningFromTheFrontend",
      "setBoxesFromTheFrontend",
      "setStorageData",
      "clearStorageData",
      "clearBoxes",
      "SetPlanningByIdAndBoxesAction",
      "setOutToBeInserted",
      "setThisOutToBeInserted",
      "changeSelectedProfileGroup",
      "setPlanningByRangeAction",
    ]),
    refresh() {
      this.getCurrentPlanningMethod();
      this.shift_intervals = [
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
        "18:00-19:00",
        "19:00-20:00",
        "20:00-21:00",
        "21:00-22:00",
        "22:00-23:00",
      ];
      if ((this.plannings.length == 0 && this.getPlanningWithTheBoxes == null && this.getPlanningWithTheBoxes?.planning == null) || !this.getSelected_profile_group || this.$route.name != this.getSelected_profile_group?.type) {
        if (this.$route.name === "rtg") {
          this.changeSelectedProfileGroupFrom_Watch(1);
        }
        else if (this.$route.name === "sts") {
          this.changeSelectedProfileGroupFrom_Watch(2);
        }

      }
    },
    getShiftByIndex(index) {
      if (index == 1) return "A";
      if (index == 2) return "B";
      if (index == 3) return "C";
      if (index == 4) return "D";
    },
    deleteFromPlanningInFirstPage(planning_id) {
      this.plannings = [...this.plannings.filter((e) => e.id != planning_id)];
      if (this.$route.name === "rtg") {
        this.changeSelectedProfileGroupFrom_Watch(1);
      }
      else if (this.$route.name === "sts") {
        this.changeSelectedProfileGroupFrom_Watch(2);
      }
    },
    clearPlannings() {
      this.plannings = [];
      if (this.$route.name === "rtg") {
        this.changeSelectedProfileGroupFrom_Watch(1);
      }
      else if (this.$route.name === "sts") {
        this.changeSelectedProfileGroupFrom_Watch(2);
      }
    },
    sendNudes(attrs, test) {
      return new Promise((resolve, reject) => {
        if (attrs.length === 0) {
          this.attributes.push({
            key: "selected",
            highlight: "teal",
            dates: [new Date(test.id)],
          });

        } else {
          this.attributes = this.attributes.map((e) => {
            if (e.key === "selected") {
              e.dates = [new Date(test.id)];
            }
            return e;
          });
        }
      });
    },
    changeSelectedProfileGroupFrom_Watch(id) {
      this.NotwaitLoading = false;
      this.selectedProfileGroup = this.getProfileGroups.filter((e) => e.id == id)[0];
      this.changeSelectedProfileGroup({ ...this.selectedProfileGroup });
      this.setPlanningByRangeAction({
        profile_group_id: this.$route.name=='rtg'?1:2
      }).then((e) => {
        this.plannings = this.getPlannings;
        this.attributes = [];
        this.plannings.map((planning) => {
          let color = (planning.shift_periode == 'morning') ? 'blue'
            : (planning.shift_periode == 'evening' ? 'yellow' : 'gray');

          this.attributes.push({
            // An optional key can be used for retrieving this attribute later,
            // and will most likely be derived from your data object
            dot: color, // Boolean, String, Object
            popover: {
              label: "Shift " + this.getShiftByIndex(planning.shift_id) + " : " + (planning.shift_periode[0].toUpperCase() + planning.shift_periode.slice(1)),
              visibility: "hover",
              hideIndicator: false,
            },
            dates: [
              new Date(planning.planned_at.split(" ")[0]), // Jan 4th
            ],
          });

        })
        this.attributes.push({
          // An optional key can be used for retrieving this attribute later,
          // and will most likely be derived from your data object
          key: "selected",
          highlight: "teal",
          hideIndicator: false,
          dates: [new Date()],
        });
        this.NotwaitLoading = true;
      })
    },
    setPlanningInMasterComp(planning) {
      this.selectedPlanning = { ...planning };
      this.showNotificationClassSuccess("The planning has been created successfully");
    },
    PlanningAlreadyCreated() {
      this.showNotificationClassFailed("This Planning is already existed !");
    },
    getCurrentPlanningMethod() {
      this.plannings = this.getPlannings;
      this.role = this.getUserRole;
      if (this.getPlanningWithTheBoxes != null) {
        this.selectedPlanning = this.getStorageData.selectedPlanning;
        this.actualShift = this.getStorageData.actualShift;
        this.selectedDate = new Date(this.getStorageData.selectedDate);
        this.ShiftIndex = this.getStorageData.ShiftIndex;
        this.setStorageData({
          selectedPlanning: this.selectedPlanning,
          actualShift: this.actualShift,
          selectedDate: this.selectedDate,
          ShiftIndex: this.ShiftIndex,
        });
      }
    },
    reset() {
      this.clearPlannings();
    },
    handleCreatePlanning(data) {
      this.createdPlanningData = data;
    },
    setSelectedPlanning(actualShift, planning, selectedDate, ShiftIndex) {
      this.actualShift = actualShift;
      this.selectedDate = selectedDate;
      this.ShiftIndex = ShiftIndex;
      this.selectedPlanning = {
        id: null,
        shift_id: actualShift.id,
        profile_group_id: this.getSelected_profile_group?.id,
        planned_at: selectedDate,
        shift_periode: this.getShiftPeriode,
      };

      this.setPlanningFromTheFrontend({ ...this.selectedPlanning });
      this.PlanningsToSHow = false;
      this.setStorageData({
        selectedPlanning: this.selectedPlanning,
        actualShift: this.actualShift,
        selectedDate: this.selectedDate,
        ShiftIndex: this.ShiftIndex,
      });
    },
    sortMatrix(matrix) {
      // Helper function to calculate the key for sorting
      function sortingKey(row) {
        let firstDashIndex = row.findIndex((item) => (item === "P" || item === "DP"));
        let afterDashElements = row
          .slice(firstDashIndex)
          .filter((item) => (item != "P" && item != "DP"))
          .join("");
        return `${firstDashIndex}-${afterDashElements}`;
      }

      // Sort the matrix rows based on the sorting key
      matrix.sort((a, b) => {
        let keyA = sortingKey(a);
        let keyB = sortingKey(b);
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });

      return matrix;
    },
    createPlanning(payload) {
      this.arrayToSave = [];
      this.tableHeaders = [];
      this.driversList = [...payload.driversList];
      this.equipmentList = [...payload.equipmentList];
      this.selectedDate = payload.selectedDate;
      let today__ = new Date();
      let dayOfMonth__ = today__.getDate();
      console.log("dayOfMonth__ ",dayOfMonth__);
      for (let i = 0; i <dayOfMonth__; i++) {
        if (this.driversList.length > 0) {
        this.driversList.unshift(this.driversList.pop());
        }

      }
      //this.setLoadingValueAction(true);
      let year = this.selectedDate.getFullYear();
      let month = String(this.selectedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
      let day = String(this.selectedDate.getDate()).padStart(2, "0");

      let formattedDate = `${year}-${month}-${day}`;
      this.planning = {
        shift_id: this.actualShift.id,
        profile_group_id: this.getSelected_profile_group?.id,
        planned_at: formattedDate,
      };

      this.selectedPlanning = {
        shift_id: this.actualShift.id,
        profile_group_id: this.getSelected_profile_group?.id,
        planned_at: formattedDate,
        shift_periode: this.getShiftPeriode.toLowerCase(),
        id: null
      };
      if (this.getSelected_profile_group.id == 1) {
        if (this.driversList.length > this.equipmentList.length) {
          this.setOutToBeInserted([]);
          this.rtgPlanning(
            true,
            this.driversList,
            this.equipmentList,
            this.ShiftIndex,
            this.selectedPlanning,
            this.tableHeaders
          );
        }
        else {
          let itemsPlanning = this.rtgFullPlanning2(this.driversList, this.equipmentList, this.ShiftIndex)
          let ThisOutToBeInserted = [];
          itemsPlanning[0].slice(1).map((e) => {
            ThisOutToBeInserted.push({
              list: [],
              checked: false
            })
            return e;
          });
          if (this.driversList.length < this.equipmentList.length) {
            let outEquipments = this.equipmentList.slice(this.driversList.length,)
            ThisOutToBeInserted = ThisOutToBeInserted.map((e) => {
              e.list = outEquipments;
              e.checked = false;
              return e;
            });
          } else {
            ThisOutToBeInserted = ThisOutToBeInserted.map((e) => {
              e.list = [];
              e.checked = false;
              return e;
            });
          }
          this.clearBoxes();
          this.setBoxesFromTheFrontend(itemsPlanning);
          this.setOutToBeInserted(ThisOutToBeInserted);
        }
      }
      else if (this.getSelected_profile_group.id == 2) {
        this.setOutToBeInserted([]);
        this.clearBoxes();
        this.shift_intervals = this.getShiftIntervals(this.ShiftIndex);
        let rows__ = this.driversList.length;
        let columns__ = 8;
        let stsList__ = [];
        stsList__ = this.equipmentList.filter((e) => e.equipmentTimesSelected.filter((c) => c).length != 0);
        stsList__ = stsList__.map((e) => {
          let sts = {
            matricule: e.matricule,
            intervals: [],
          };
          for (let i = 0; i < 8; i++) {
            if (e.equipmentTimesSelected[i]) {
              sts.intervals.push(this.shift_intervals[i]);
            }
          }
          return sts;
        });
        let shift__ = [...this.shift_intervals];
        this.driversList = this.driversList.sort((a, b) => b.workingHours - a.workingHours);
        stsList__ = stsList__.sort((a, b) => a.intervals.length - b.intervals.length);
        let rst = this.createSTSPlanning(rows__, columns__, stsList__, shift__);

        let itemsPlanning_temp = rst.thePlanning;
        let itemsPlanning = [];
        let header = [];
        let equipmentTimesChecked = this.equipmentList.filter((e) => e.equipmentTimesSelected.filter((c) => c).length != 0);
        header.push({
          text: "Drivers | WH",
          sortable: true,
          key: "workingHours",
          align: "Drivers | WH",
          title: "Drivers | WH",
          value: "Drivers | WH",
        });
        for (let index = 0; index < itemsPlanning_temp[0].length; index++) {
          header.push({
            text: itemsPlanning_temp[0][index],
            sortable: false,
            key: "driver",
            align: "start",
            title: itemsPlanning_temp[0][index],
            value: itemsPlanning_temp[0][index],
          });
        }
        itemsPlanning.push(header);
        for (let index = 1; index < itemsPlanning_temp.length; index++) {
          let row = [];

          row.push(this.driversList[index - 1]);
          for (let i = 0; i < itemsPlanning_temp[0].length; i++) {


            if (itemsPlanning_temp[index][i] != "-") {
              let thisEquipment = equipmentTimesChecked.filter((e) => e.matricule == itemsPlanning_temp[index][i])[0];
              row.push(thisEquipment);
            }
            else {
              row.push("P");
            }
          }
          itemsPlanning.push(row);
        }
        itemsPlanning = this.sortMatrix(JSON.parse(JSON.stringify(itemsPlanning)).slice(1));
        itemsPlanning.unshift(header);
        this.setBoxesFromTheFrontend(itemsPlanning);

        let ThisOutToBeInserted = itemsPlanning[0].slice(1).map((e) => {
          return {
            list: [],
            checked: false
          }

        });
        for (let index = 0; index < ThisOutToBeInserted.length; index++) {
          let thisLeftSts = rst.stsListtoBegin
            .filter((e) => {
              return e.intervals.filter((i) => {
                return i == this.shift_intervals[index];
              }).length > 0
            })
            .map((e) => {
              let thisOut = equipmentTimesChecked.filter((c) => {
                return c.matricule == e.matricule;
              });
              thisOut.map((out) => {
                ThisOutToBeInserted[index].list.push(out);
              })
            });
        }
        this.setOutToBeInserted(ThisOutToBeInserted);
      }

    },
    getShiftIntervals(shiftIndex) {
      let headers = [];
      let tempPlanning = [];
      if (shiftIndex == 0) {
        headers = [
          "07:00-08:00",
          "08:00-09:00",
          "09:00-10:00",
          "10:00-11:00",
          "11:00-12:00",
          "12:00-13:00",
          "13:00-14:00",
          "14:00-15:00",
        ];
      }
      else if (shiftIndex == 1) {
        headers = [
          "15:00-16:00",
          "16:00-17:00",
          "17:00-18:00",
          "18:00-19:00",
          "19:00-20:00",
          "20:00-21:00",
          "21:00-22:00",
          "22:00-23:00",
        ];
      }
      else if (shiftIndex == 2) {
        headers = [
          "23:00-00:00",
          "00:00-01:00",
          "01:00-02:00",
          "02:00-03:00",
          "03:00-04:00",
          "04:00-05:00",
          "05:00-06:00",
          "06:00-07:00",
        ];
      }
      return headers;
    },
    CustomRtgPlanning(saveIt, driversList, equipmentList, ShiftIndex, selectedPlanning, tableHeaders) {
      return new Promise((resolve, reject) => {
        this.arrayToSave = [];
        this.tableHeaders = [];

        // Assuming rtgPlanning returns a Promise or needs to be handled as async
        this.rtgPlanning(
          saveIt,
          driversList,
          equipmentList,
          ShiftIndex,
          selectedPlanning,
          tableHeaders
        )
      });
    },
    rtgPlanning(
      saveIt,
      driversList,
      equipmentList,
      ShiftIndex,
      selectedPlanning,
      tableHeaders
    ) {
      console.log("this is from rtg planning tableHeaders:",tableHeaders)
      console.log("this is from rtg planning ShiftIndex:",ShiftIndex)
      let nbrDrivers = driversList.length;
      let nbrRtgs = equipmentList.length;
      let nbrSubs = nbrDrivers - nbrRtgs;
      let nbrCols = Math.ceil(nbrDrivers / nbrSubs);
      let colDuration = 480 / nbrCols;
      let divNbrDriverPerNbrSubs = nbrDrivers % nbrSubs;
      let nbrDoubleBreak =
        divNbrDriverPerNbrSubs != 0 ? nbrSubs - divNbrDriverPerNbrSubs : 0;
      driversList = driversList.sort(function (a, b) {
        return b.workingHours - a.workingHours;
      });
      let startTime = 0;
      switch (ShiftIndex) {
        case 0:
          startTime = 7;
          break;
        case 1:
          startTime = 15;
          break;
        case 2:
          startTime = 23;
          break;
        default:
          startTime = 0;
          break;
      }
      for (let i = 0; i < nbrCols; i++) {
        let hours = Math.floor(startTime); // Extract whole hours
        let minutes = Math.round((startTime - hours) * 60); // Extract remaining minutes and round
        // Adjust minutes if they exceed 60
        if (minutes >= 60) {
          hours += 1; // Increment hours
          minutes -= 60; // Subtract 60 from minutes
        }

        // Format startTime as "hh:mm"
        let startTimeFormatted =
          (hours < 10 ? "0" : "") +
          hours +
          ":" +
          (minutes < 10 ? "0" : "") +
          minutes;

        // Calculate endTime
        let endTime = startTime + colDuration / 60;
        if (endTime >= 24) {
          endTime -= 24; // Adjust for overflow past midnight
        }

        let endTimeHours = Math.floor(endTime); // Extract whole hours for end time
        let endTimeMinutes = Math.round((endTime - endTimeHours) * 60); // Extract remaining minutes and round

        // Adjust endTime if minutes exceed 60
        if (endTimeMinutes >= 60) {
          endTimeHours += 1; // Increment hours
          endTimeMinutes -= 60; // Subtract 60 from minutes
        }
        // Format endTime as "hh:mm"
        let endTimeFormatted =
          (endTimeHours < 10 ? "0" : "") +
          endTimeHours +
          ":" +
          (endTimeMinutes < 10 ? "0" : "") +
          endTimeMinutes;
        // Push start and end times to the tableHeaders array
        tableHeaders.push({
          title: startTimeFormatted + "-" + endTimeFormatted,
          sortable: false,
        });

        // Update startTime for the next iteration
        startTime = endTimeHours + endTimeMinutes / 60;
        if (startTime >= 24) {
          startTime -= 24; // Adjust for overflow past midnight
        }
      }
      console.log("parse data : ",JSON.parse(JSON.stringify(tableHeaders)))
      if(ShiftIndex==0){
        tableHeaders[tableHeaders.length-1].title=tableHeaders[tableHeaders.length-1].title.split("-")[0]+"-"+"15:00"
      }
      else if(ShiftIndex==1){
        tableHeaders[tableHeaders.length-1].title=tableHeaders[tableHeaders.length-1].title.split("-")[0]+"-"+"23:00"
      }
      else if(ShiftIndex==2){
        tableHeaders[tableHeaders.length-1].title=tableHeaders[tableHeaders.length-1].title.split("-")[0]+"-"+"07:00"

      }
      const itemsPlanning = [];
      itemsPlanning.push(["Drivers | WH", ...tableHeaders]);
      for (let i = 0; i < nbrDrivers; i++) {
        itemsPlanning.push(Array(nbrCols + 1).fill(driversList[i]));
      }
      let k = 0;
      for (let i = 1; i < nbrDrivers + 1; i += nbrSubs) {
        k++;
        let maxJ = i + nbrSubs;
        if (maxJ > nbrDrivers) maxJ = maxJ - nbrDoubleBreak;
        for (let j = i; j < maxJ; j++) {
          itemsPlanning[j][k] = "P";
        }
      }
      let startDoubleBreak = itemsPlanning.length - nbrSubs;
      let rtgsIndex = 0;
      for (let j = 1; j < nbrCols + 1; j++) {
        rtgsIndex = 0;
        for (let i = 1; i < nbrDrivers + 1; i++) {
          if (itemsPlanning[i][j] != "P") {
            if (rtgsIndex < equipmentList.length) {
              // Check if rtgsIndex is within bounds
              itemsPlanning[i][j] = equipmentList[rtgsIndex];
              rtgsIndex++;
            } else {
              // Handle the case when rtgsIndex exceeds the length of rtgs array
              // For example, you can break the loop or handle it according to your logic.
              break;
            }
          }
        }
      }
      if (nbrDoubleBreak != 0) {
        for (
          let i = startDoubleBreak;
          i < startDoubleBreak + nbrDoubleBreak;
          i++
        ) {
          itemsPlanning[i][k] = "DP";
        }
        const doubleBreakDrivers = [];

        for (let i = 1; i < nbrDrivers + 1; i++) {
          if (itemsPlanning[i][nbrCols] == "DP") {
            doubleBreakDrivers.push({
              index: i,
              driver: itemsPlanning[i][0],
            });
          }
        }
        const firstValues = [];

        for (let i = 1; i < doubleBreakDrivers.length + 1; i++) {
          firstValues.push(itemsPlanning[i][0]);
        }
        const nonCommonValuesT1 = firstValues.filter(
          (obj1) =>
            !doubleBreakDrivers.some(
              (obj2) => obj1.matricule === obj2.driver.matricule
            )
        );
        const nonCommonValuesT2 = doubleBreakDrivers.filter(
          (obj1) =>
            !firstValues.some(
              (obj2) => obj2.matricule === obj1.driver.matricule
            )
        );
        for (let i = 1; i < nonCommonValuesT1.length + 1; i++) {
          let temp = nonCommonValuesT1[i - 1];
          let driver = driversList.find(
            (obj) => obj.matricule === nonCommonValuesT2[i - 1].driver.matricule
          );
          let index = driversList.indexOf(driver);
          itemsPlanning[i][0] = driver;
          itemsPlanning[index + 1][0] = temp;
        }
        const id = 1;
        let parts = [];
        for (let i = 1; i < nbrDrivers + 1; i++) {
          for (let j = 1; j < nbrCols + 1; j++) {
            const equipementId =
              itemsPlanning[i][j] == "P" || itemsPlanning[i][j] == "DP"
                ? null
                : equipmentList.find(
                  (rtg) => rtg.matricule === itemsPlanning[i][j].matricule
                )?.id;
            parts = itemsPlanning[0][j].title.split("+")[0].split("-");

            const boxObject = {
              planning_id: selectedPlanning.id,
              user_id: itemsPlanning[i][0].id,
              equipement_id: equipementId,
              break:
                itemsPlanning[i][j] == "P" || itemsPlanning[i][j] == "DP"
                  ? true
                  : false,
              start_time: parts[0],
              ends_time: parts[1],
            };

            this.arrayToSave.push(boxObject);
          }
        }
      }

      if (saveIt) {
        this.clearBoxes();
        this.setBoxesFromTheFrontend(itemsPlanning);
        let ThisOutToBeInserted = itemsPlanning[0].slice(1).map((e) => {
          e.list = [];
          e.checked = false;
          return e;
        });
        this.setOutToBeInserted(ThisOutToBeInserted);
      } else {
        this.checkEditedPlanning = itemsPlanning;
      }
      this.arrayToSave = [];
      this.tableHeaders = [];
    },
    rtgFullPlanning(drivers, equipments, shiftIndex) {
      return new Promise((resolve, reject) => {
        let headers = [];
        let tempPlanning = [];
        if (shiftIndex == 0) {
          headers = [
            "07:00-08:00",
            "08:00-09:00",
            "09:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
            "12:00-13:00",
            "13:00-14:00",
            "14:00-15:00",
          ];
        } else if (shiftIndex == 1) {
          headers = [
            "15:00-16:00",
            "16:00-17:00",
            "17:00-18:00",
            "18:00-19:00",
            "19:00-20:00",
            "20:00-21:00",
            "21:00-22:00",
            "22:00-23:00",
          ];
        } else if (shiftIndex == 2) {
          headers = [
            "23:00-00:00",
            "00:00-01:00",
            "01:00-02:00",
            "02:00-03:00",
            "03:00-04:00",
            "04:00-05:00",
            "05:00-06:00",
            "06:00-07:00",
          ];
        }
        tempPlanning.push(["Drivers | WH", ...headers]);
        for (let index = 0; index < drivers.length; index++) {
          let planningRow = [drivers[index]];
          for (let i = 0; i < 8; i++) {
            planningRow.push(equipments[index])
          }
          tempPlanning.push(planningRow);
        }

        this.checkEditedPlanning = tempPlanning;

        // Resolve the promise with the planning data
        resolve(tempPlanning);
      });
    }
    ,
    rtgFullPlanning2(drivers, equipments, shiftIndex) {
      let headers = [];
      let tempPlanning = [];
      if (shiftIndex == 0) {
        headers = [
          {
            sortable: false,
            title: "07:00-08:00"
          },
          {
            sortable: false,
            title: "08:00-09:00"
          },
          {
            sortable: false,
            title: "09:00-10:00",
          },
          {
            sortable: false,
            title: "10:00-11:00",
          },
          {
            sortable: false,
            title: "11:00-12:00",
          },
          {
            sortable: false,
            title: "12:00-13:00",
          },
          {
            sortable: false,
            title: "13:00-14:00",
          },
          {
            sortable: false,
            title: "14:00-15:00",
          }
        ];
      }
      else if (shiftIndex == 1) {
        headers = [
          {
            sortable: false,
            title: "15:00-16:00",
          },
          {
            sortable: false,
            title: "16:00-17:00",
          },
          {
            sortable: false,
            title: "17:00-18:00",
          },
          {
            sortable: false,
            title: "18:00-19:00",
          },
          {
            sortable: false,
            title: "19:00-20:00",
          },
          {
            sortable: false,
            title: "20:00-21:00",
          },
          {
            sortable: false,
            title: "21:00-22:00",
          },
          {
            sortable: false,
            title: "22:00-23:00",
          }
        ];
      }
      else if (shiftIndex == 2) {
        headers = [
          {
            sortable: false,
            title: "23:00-00:00",
          },
          {
            sortable: false,
            title: "00:00-01:00",
          },
          {
            sortable: false,
            title: "01:00-02:00",
          },
          {
            sortable: false,
            title: "02:00-03:00",
          },
          {
            sortable: false,
            title: "03:00-04:00",
          },
          {
            sortable: false,
            title: "04:00-05:00",
          },
          {
            sortable: false,
            title: "05:00-06:00",
          },
          {
            sortable: false,
            title: "06:00-07:00",
          }
        ];
      }

      tempPlanning.push(["Drivers | WH", ...headers]);
      for (let index = 0; index < drivers.length; index++) {
        let planningRow = [drivers[index]];
        for (let i = 0; i < 8; i++) {
          planningRow.push(equipments[index])

        }
        tempPlanning.push(planningRow);
      }
      return tempPlanning;
    },
    showNotificationClassSuccess(msg) {
      this.notificationClassSuccessMsg = msg;
      // Show the notification
      setTimeout(() => {
        this.notificationClassSuccess = "show sucess";
      }, 500);

      // Hide the notification after 3 seconds
      setTimeout(() => {
        this.notificationClassSuccess = "hide sucess";
      }, 6000);
    },
    showNotificationClassFailed(msg) {
      this.notificationClassFailedMsg = msg;
      // Show the notification
      setTimeout(() => {
        this.notificationClassFailed = "show Failed";
      }, 500);

      setTimeout(() => {
        this.notificationClassFailed = "hide Failed";
      }, 6000);
    },
    hideNotificationClassSuccess() {
      this.notificationClassSuccess = "hide sucess";
    },
    hideNotificationClassFailed() {
      this.notificationClassFailed = "hide Failed";
    },
    getCurrentPlanningAndBoxes(
      id,
      actualShift,
      selectedDate,
      selectedPlanning,
      ShiftIndex
    ) {
      this.SetPlanningByIdAndBoxesAction({
        id: id,
      });

      this.actualShift = actualShift;
      this.selectedDate = selectedDate;
      this.selectedPlanning = selectedPlanning;
      this.ShiftIndex = ShiftIndex;
    },
    createSTSPlanning(rows, columns, stsList, shift) {
  let saveStsList = [...stsList];
  const totalHours = stsList.reduce((total, sts) => {
    return (total += sts.intervals.length);
  }, 0);
  const T = rows * columns - totalHours;
  const numberOfBreaks = Math.floor(T / rows);
  const numberOfDoubleBreaks = (numberOfBreaks * rows - T) * -1;
  console.log("totalHours : ", totalHours);
  console.log("Drivers : ", rows);
  console.log("numberOfBreaks : ", numberOfBreaks);
  console.log("number driver with DoubleBreaks : ", numberOfDoubleBreaks);
  stsList.forEach((sts) => {
    let oneSTSplanning = [];
    shift.forEach((planningInterval) => {
      let hour = "-----------";
      sts.intervals.forEach((stsInterval) => {
        if (planningInterval == stsInterval) hour = stsInterval;
      });
      oneSTSplanning.push(hour);
    });
  });
  //generatePlanning(rows, columns, stsList);
  function getDriverinalWOrkingHours(driver) {
    return columns - numberOfBreaks - (driver <= numberOfDoubleBreaks ? 1 : 0);
  }
  function moveToFirstByMatricule(arr, matricule) {
    // Find the index of the object with the specified matricule
    const index = arr.findIndex((item) => item.matricule === matricule);

    // If the object is found and it's not already the first element
    if (index > -1 && index !== 0) {
      // Remove the object from its current position
      const [item] = arr.splice(index, 1);
      // Insert the object at the beginning of the array
      arr.unshift(item);
    }

    return arr;
  }
  function checkIntervalForSts(stsList, matricule, interval) {
    const sts = stsList.find((sts) => sts.matricule == matricule);
    if (sts) {
      return sts.intervals.includes(interval);
    }

    return false;
  }
  function IntervalIsExistedInTheSTSList(stsPlanning, interval) {
    for (let sts of stsPlanning) {
      if (sts.intervals.includes(interval)) {
        return true;
      }
    }
    return false;
  }
  function ItsABreak(
    stsPlanning,
    oneDriverPlanning,
    oneDriverPlanningHourex,
    driverIndex
  ) {
    let countWorkingHours = oneDriverPlanning.filter((value) =>
      value.startsWith("STS")
    ).length;

    if (getDriverinalWOrkingHours(driverIndex) <= countWorkingHours)
      return true;

    if (
      oneDriverPlanningHourex == 0 ||
      oneDriverPlanning[oneDriverPlanningHourex - 1] == "-"
    ) {
      return !IntervalIsExistedInTheSTSList(
        stsPlanning,
        shift[oneDriverPlanningHourex]
      );
    } else {
      if (
        IntervalIsExistedInTheSTSList(
          stsPlanning,
          shift[oneDriverPlanningHourex]
        )
      ) {
        let occurence = oneDriverPlanning.filter(
          (item) => item === oneDriverPlanning[oneDriverPlanningHourex - 1]
        ).length;

        if (occurence > 2) {
          return true;
        } else {
          return !checkIntervalForSts(
            stsPlanning,
            oneDriverPlanning[oneDriverPlanningHourex - 1],
            shift[oneDriverPlanningHourex]
          );
        }
      } else {
        return true;
      }
    }
  }
  function setOneDriverPlanning(stsListtoBegin, driverIndex) {
    let stsPlanning = [...stsListtoBegin];
    let oneDriverPlanning = [...shift];

    let countDouble = 0;
    let tooked = false;
    /* matricule: "STS4",

        intervals: [
            */

    oneDriverPlanning.forEach(
      (oneDriverPlanningHour, oneDriverPlanningHourex) => {
        if (oneDriverPlanningHourex > 0) {
          stsPlanning = moveToFirstByMatricule(
            stsPlanning,
            oneDriverPlanning[oneDriverPlanningHourex - 1]
          );
        }
        let stsCountOccurence = stsPlanning.filter((e) => {
          return (
            e.intervals.filter((c) => {
              return c == oneDriverPlanning[oneDriverPlanningHourex];
            }).length > 0
          );
        });
        if (
          !ItsABreak(
            stsPlanning,
            oneDriverPlanning,
            oneDriverPlanningHourex,
            driverIndex
          )
        ) {
          stsPlanning.forEach((sts, index) => {
            countDouble = 0;
            tooked = false;
            sts.intervals.forEach((stsInterval, index) => {
              let occurence = oneDriverPlanning.filter(
                (item) => item === sts.matricule
              ).length;
              if (occurence < 3)
                if (
                  oneDriverPlanning[oneDriverPlanningHourex][0] != "S" &&
                  oneDriverPlanningHour == stsInterval
                ) {
                  if (
                    oneDriverPlanningHourex == 0 ||
                    occurence == 0 ||
                    (oneDriverPlanningHourex > 0 &&
                      oneDriverPlanning[oneDriverPlanningHourex - 1] ==
                      sts.matricule)
                  ) {
                    oneDriverPlanning[oneDriverPlanningHourex] = sts.matricule;
                    let stsCopy = stsPlanning.find(
                      (sts1) => sts1.matricule === sts.matricule
                    );
                    stsCopy.intervals = [
                      ...stsCopy.intervals.filter(
                        (interval) => interval != stsInterval
                      ),
                    ];
                    stsPlanning[
                      stsPlanning.findIndex(
                        (sts1) => sts1.matricule === stsCopy.matricule
                      )
                    ].intervals = [...stsCopy.intervals];
                  }
                }
            });
          });
        } else {
          oneDriverPlanning[oneDriverPlanningHourex] = "-";
        }
        if (
          oneDriverPlanning[oneDriverPlanningHourex] != "-" &&
          oneDriverPlanning[oneDriverPlanningHourex][0] != "S"
        ) {
          oneDriverPlanning[oneDriverPlanningHourex] = "-";
        }
      }
    );

    return {
      oneDriverPlanning: oneDriverPlanning,
      stsPlanning: stsPlanning,
    };
  }
  //condition :
  //1 - if he has space
  //2 - if he has the same sts but not 3 hours
  //3 - if he can change the requested hour

  //when to change :
  //1- if he has empty place and minced hours
  function canBeInserted2(oneDriverPlanning, sts, columnIndex) {
    if (oneDriverPlanning[columnIndex] != "-") return false;
    let occurence = oneDriverPlanning.filter((item) => item === sts).length;

    if (occurence > 0) {
      if (occurence > 2) {
        return false;
      } else if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != sts) {
          return false;
        }
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != sts) {
          return false;
        }
      } else {
        if (
          oneDriverPlanning[columnIndex - 1] != sts &&
          oneDriverPlanning[columnIndex + 1] != sts
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex - 1] == sts &&
          oneDriverPlanning[columnIndex + 1] != "-"
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex + 1] == sts &&
          oneDriverPlanning[columnIndex - 1] != "-"
        ) {
          return false;
        }
      }
    } else {
      if ((sts = "STS3" && columnIndex == 7)) {
      }
      if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != "-") return false;
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != "-") return false;
      }
      if (
        oneDriverPlanning[columnIndex - 1] != "-" ||
        oneDriverPlanning[columnIndex + 1] != "-"
      ) {
        return false;
      }
    }
    return true;
  }
  function canBeInserted3(oneDriverPlanning, sts, columnIndex) {
    if (oneDriverPlanning[columnIndex] != "-") return false;
    let occurence = oneDriverPlanning.filter((item) => item === sts).length;

    if (occurence > 0) {
      if (occurence > 2) {
        return false;
      } else if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != sts) {
          return false;
        }
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != sts) {
          return false;
        }
      } else {
        if (
          oneDriverPlanning[columnIndex - 1] != sts &&
          oneDriverPlanning[columnIndex + 1] != sts
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex - 1] == sts &&
          oneDriverPlanning[columnIndex + 1] != "-"
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex + 1] == sts &&
          oneDriverPlanning[columnIndex - 1] != "-"
        ) {
          return false;
        }
      }
    } else {
      if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != "-") return false;
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != "-") return false;
      } else if (
        oneDriverPlanning[columnIndex - 1] != "-" ||
        oneDriverPlanning[columnIndex + 1] != "-"
      )
        return false;
    }
    return true;
  }
  function canBeInserted(oneDriverPlanning, sts, columnIndex) {
    if (oneDriverPlanning[columnIndex] != "-") return false;
    let occurence = oneDriverPlanning.filter((item) => item === sts).length;

    if (occurence > 0) {
      if (occurence > 2) {
        return false;
      } else if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != sts) {
          return false;
        }
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != sts) {
          return false;
        }
      } else {
        if (
          oneDriverPlanning[columnIndex - 1] != sts &&
          oneDriverPlanning[columnIndex + 1] != sts
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex - 1] == sts &&
          oneDriverPlanning[columnIndex + 1] != "-"
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex + 1] == sts &&
          oneDriverPlanning[columnIndex - 1] != "-"
        ) {
          return false;
        }
      }
    } else {
      if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != "-") return false;
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != "-") return false;
      }
      if (
        oneDriverPlanning[columnIndex - 1] != "-" ||
        oneDriverPlanning[columnIndex + 1] != "-"
      )
        return false;
    }
    return true;
  }
  function canBeInsertedForcely(oneDriverPlanning, sts, columnIndex) {
    if (oneDriverPlanning[columnIndex] != "-") return false;
    let occurence = oneDriverPlanning.filter((item) => item === sts).length;

    if (occurence > 0) {
      if (occurence > 2) {
        return false;
      } else if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != sts) {
          return false;
        }
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != sts) {
          return false;
        }
      } else {
        if (
          oneDriverPlanning[columnIndex - 1] != sts &&
          oneDriverPlanning[columnIndex + 1] != sts
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex - 1] == sts &&
          oneDriverPlanning[columnIndex + 1] != "-"
        ) {
          return false;
        }
        if (
          oneDriverPlanning[columnIndex + 1] == sts &&
          oneDriverPlanning[columnIndex - 1] != "-"
        ) {
          return false;
        }
      }
    } else {
      if (columnIndex == oneDriverPlanning.length - 1) {
        if (oneDriverPlanning[columnIndex - 1] != "-") return false;
      } else if (columnIndex == 0) {
        if (oneDriverPlanning[columnIndex + 1] != "-") return false;
      }
      if (
        oneDriverPlanning[columnIndex - 1] != "-" ||
        oneDriverPlanning[columnIndex + 1] != "-"
      )
        return false;
    }
    return true;
  }
  function countWH(row) {
    return row.filter((e) => e != "-").length;
  }
  function countWH_2(row) {
    console.log("count :",row)
    return row.filter((e) => e != "-").length;
  }
  function TryToMinceAnHour(
    thePlanning,
    columnOfTheMissingOne,
    indexOfTheMissingOne
  ) {
    let minced = false;
    let thePlanningToReduce = [...thePlanning];

    for (
      let columnIndex = 0;
      columnIndex < thePlanningToReduce[indexOfTheMissingOne].length;
      columnIndex++
    ) {
      let occurence = thePlanningToReduce[indexOfTheMissingOne].filter(
        (item) =>
          item === thePlanningToReduce[indexOfTheMissingOne][columnIndex]
      ).length;
      if (
        occurence == 3 &&
        columnIndex != 0 &&
        columnIndex != thePlanningToReduce[indexOfTheMissingOne].length - 1 &&
        thePlanningToReduce[indexOfTheMissingOne][columnIndex - 1] ==
        thePlanningToReduce[indexOfTheMissingOne][columnIndex] &&
        thePlanningToReduce[indexOfTheMissingOne][columnIndex + 1] ==
        thePlanningToReduce[indexOfTheMissingOne][columnIndex]
      ) {
      } else {
        if (
          columnOfTheMissingOne != columnIndex &&
          !minced &&
          thePlanningToReduce[indexOfTheMissingOne][columnIndex] != "-"
        )
          for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
            if (indexOfTheMissingOne != rowIndex && !minced) {
              if (
                countWH(thePlanningToReduce[rowIndex]) <
                getDriverinalWOrkingHours(rowIndex) &&
                canBeInserted(
                  thePlanningToReduce[rowIndex],
                  thePlanningToReduce[indexOfTheMissingOne][columnIndex],
                  columnIndex
                )
              ) {
                thePlanningToReduce[rowIndex][columnIndex] =
                  thePlanningToReduce[indexOfTheMissingOne][columnIndex];
                thePlanningToReduce[indexOfTheMissingOne][columnIndex] = "-";
                minced = true;
              }
            }
          }
      }
    }
    return {
      minced: minced,
      thePlanningToReduce: thePlanningToReduce,
    };
  }
  function insertSTSHour(thePlanning, sts, hour) {
    let inserted = false;
    let thePlanningToReduce = [...thePlanning];
    let columnIndex = -1;
    for (let index = 0; index < shift.length; index++) {
      if (shift[index] == hour) {
        columnIndex = index;
      }
    }

    if (columnIndex != -1)
      for (let index = 0; index < rows; index++) {
        if (
          countWH(thePlanningToReduce[index]) <
          getDriverinalWOrkingHours(index) &&
          canBeInserted(thePlanningToReduce[index], sts, columnIndex)
        ) {
          thePlanningToReduce[index][columnIndex] = sts;
          inserted = true;
          break;
        }
      }

    //safi hna maymknch dkhl 3adi donc db an9ss mn chi row bach ndkhlha
    if (!inserted)
      for (let index = 0; index < rows; index++) {
        if (canBeInserted(thePlanningToReduce[index], sts, columnIndex)) {
          if (
            countWH(thePlanningToReduce[index]) <
            getDriverinalWOrkingHours(index)
          ) {
            thePlanningToReduce[index][columnIndex] = sts;
            inserted = true;
          } else {
            //hna khasni n9ss sa3a mn had row : thePlanningToReduce[index]

            let rst = TryToMinceAnHour(thePlanning, columnIndex, index);
            if (rst.minced) {
              thePlanningToReduce = [...rst.thePlanningToReduce];
              thePlanningToReduce[index][columnIndex] = sts;

              inserted = true;
              break;
            }
          }
        }
      }

    return {
      inserted: inserted,
      thePlanningToReduce2: thePlanningToReduce,
    };
  }
  function bestEnhancement(thePlanning, stsListtoBegin) {
    let stsListToReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];
    let thePlanningToReduce = [...thePlanning];
    let count = 0;
    while (count < 20) {
      if (stsListToReduce.length > 0) {
        for (let stsIndex = 0; stsIndex < stsListToReduce.length; stsIndex++) {
          const MissingStsIntervals = stsListToReduce[stsIndex];
          for (
            let MissingStsIntervalsIndex = 0;
            MissingStsIntervalsIndex < MissingStsIntervals.intervals.length;
            MissingStsIntervalsIndex++
          ) {
            const stsInterval =
              MissingStsIntervals.intervals[MissingStsIntervalsIndex];

            let rst = insertSTSHour(
              thePlanningToReduce,
              MissingStsIntervals.matricule,
              stsInterval
            );
            if (rst.inserted) {
              thePlanningToReduce = [...rst.thePlanningToReduce2];
              let stsCopy = stsListToReduce.find(
                (sts1) => sts1.matricule === MissingStsIntervals.matricule
              );
              stsCopy.intervals = [
                ...stsCopy.intervals.filter(
                  (interval) => interval != stsInterval
                ),
              ];
              stsListToReduce[
                stsListToReduce.findIndex(
                  (sts1) => sts1.matricule === MissingStsIntervals.matricule
                )
              ].intervals = [...stsCopy.intervals];
            }
          }
        }
      }
      count++;
    }
    return {
      thePlanningToReduce: thePlanningToReduce,
      stsListToReduce: stsListToReduce,
    };
  }
  function switchThisHours(stsListtoBegin, STSToRemove, STSToAdd, columnIndex) {
    let stsListToBeSwitched = [...stsListtoBegin];
    if (STSToAdd != "-")
      stsListToBeSwitched = [
        ...stsListToBeSwitched.map((e) => {
          if (e.matricule == STSToRemove) {
            e.intervals = [
              ...e.intervals.filter(
                (interval) => interval != shift[columnIndex]
              ),
            ];
          }
          if (e.matricule == STSToAdd) {
            e.intervals.push(shift[columnIndex]);
            return e;
          }
          return e;
        }),
      ];
    if (
      STSToAdd != "-" &&
      stsListToBeSwitched.filter((e) => e.matricule == STSToAdd).length == 0
    ) {
      stsListToBeSwitched.push({
        matricule: STSToAdd,
        intervals: [shift[columnIndex]],
      });
    }
    stsListToBeSwitched = stsListToBeSwitched.filter(
      (e) => e.intervals.length > 0
    );
    return stsListToBeSwitched;
  }

  //FORCE INSERTION-----------------------------------------------------------------------------------
  function forceInsertion2(thePlanning, stsListtoBegin) {
    let inserted = false;

    let stsListtoReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];

    let thePlanningToReduce = [...thePlanning.map((e) => e)];
    for (let STSIndex = 0; STSIndex < stsListtoReduce.length; STSIndex++) {
      for (
        let intervalndex = 0;
        intervalndex < stsListtoReduce[STSIndex].intervals.length;
        intervalndex++
      ) {
        let columnIndex = -1;
        for (let index = 0; index < shift.length; index++) {
          if (
            shift[index] == stsListtoReduce[STSIndex].intervals[intervalndex]
          ) {
            columnIndex = index;
          }
        }
        if (columnIndex != -1) {
          for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let stsOldOne = thePlanningToReduce[rowIndex][columnIndex] + "";
            let thePlanningtoReduceCopy = [...thePlanningToReduce];
            if (
              !inserted &&
              canBeInserted(
                thePlanningtoReduceCopy[rowIndex],
                stsListtoReduce[STSIndex].matricule,
                columnIndex
              )
            ) {
              thePlanningtoReduceCopy[rowIndex][columnIndex] =
                stsListtoReduce[STSIndex].matricule;
              let stsListtoReduceCopy = [...stsListtoReduce];
              stsListtoReduceCopy = switchThisHours(
                stsListtoReduce,
                stsListtoReduce[STSIndex].matricule,
                stsOldOne,
                columnIndex
              );
              stsListtoReduce = [...stsListtoReduceCopy];
              thePlanningToReduce[rowIndex][columnIndex] =
                stsListtoReduce[STSIndex].matricule;
              inserted = true;

              break;
            }
          }
        }
      }
    }
    return {
      inserted: inserted,
      thePlanning: thePlanningToReduce,
      stsListtoBegin: stsListtoReduce,
    };
  }
  //SIMPLE INSERTION-----------------------------------------------------------------------------------
  function simpleInsertion(thePlanning, stsListtoBegin) {
    let inserted = false;

    let stsListtoReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];

    let thePlanningToReduce = [...thePlanning.map((e) => e)];
    for (let STSIndex = 0; STSIndex < stsListtoReduce.length; STSIndex++) {
      for (
        let intervalndex = 0;
        intervalndex < stsListtoReduce[STSIndex].intervals.length;
        intervalndex++
      ) {
        let columnIndex = -1;
        for (let index = 0; index < shift.length; index++) {
          if (
            shift[index] == stsListtoReduce[STSIndex].intervals[intervalndex]
          ) {
            columnIndex = index;
          }
        }
        if (columnIndex != -1) {
          for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
            let stsOldOne = thePlanningToReduce[rowIndex][columnIndex] + "";
            let thePlanningtoReduceCopy = [...thePlanningToReduce];
            if (
              !inserted &&
              canBeInserted3(
                thePlanningtoReduceCopy[rowIndex],
                stsListtoReduce[STSIndex].matricule,
                columnIndex
              )
            ) {
              thePlanningtoReduceCopy[rowIndex][columnIndex] =
                stsListtoReduce[STSIndex].matricule;
              let stsListtoReduceCopy = [...stsListtoReduce];
              stsListtoReduceCopy = switchThisHours(
                stsListtoReduce,
                stsListtoReduce[STSIndex].matricule,
                stsOldOne,
                columnIndex
              );
              stsListtoReduce = [...stsListtoReduceCopy];
              thePlanningToReduce[rowIndex][columnIndex] =
                stsListtoReduce[STSIndex].matricule;
              inserted = true;

              break;
            }
          }
        }
      }
    }
    return {
      inserted: inserted,
      thePlanning: thePlanningToReduce,
      stsListtoBegin: stsListtoReduce,
    };
  }
  function insertWithPillars(thePlanningToReduce, columnIndex, missinOne) {
    for (let index = 1; index < thePlanningToReduce.length; index++) {
      if (thePlanningToReduce[index][columnIndex] == "-") {
        for (let column_Indexor = 0; column_Indexor < 8; column_Indexor++) {
          const firstElementElement = column_Indexor == 0 ? true : false;
          const lastElement =
            column_Indexor == thePlanningToReduce[0].length - 1 ? true : false;

          let thePlanningToReduce_2 = JSON.parse(
            JSON.stringify(thePlanningToReduce)
          );
          let copyPlanningToRe = toBeloweFunction(
            JSON.parse(JSON.stringify(thePlanningToReduce_2)),
            index,
            column_Indexor
          );
          if (
            copyPlanningToRe != null &&
            !firstElementElement &&
            !lastElement &&
            copyPlanningToRe[index][column_Indexor - 1] ==
            copyPlanningToRe[index][column_Indexor + 1]
          ) {
            copyPlanningToRe = null;
          }

          if (copyPlanningToRe != null) {
            if (
              canBeInserted3(copyPlanningToRe[index], missinOne, columnIndex)
            ) {
              copyPlanningToRe[index][columnIndex] = missinOne;
              thePlanningToReduce = JSON.parse(
                JSON.stringify(copyPlanningToRe)
              );
              return thePlanningToReduce;
            } else {
              let copyPlanningToRe_2 = JSON.parse(
                JSON.stringify(copyPlanningToRe)
              );
              let rst = toBeloweFunction_many(
                copyPlanningToRe_2,
                index,
                columnIndex,
                missinOne
              );
              if (rst) {
                thePlanningToReduce = JSON.parse(JSON.stringify(rst));
                return thePlanningToReduce;
              }
            }
          }
        }
      }
    }

    //for (let index = 1; index < thePlanningToReduce.length; index++) {
    //  if(thePlanningToReduce[index][columnIndex]=='-'){
    //    for (let column_Indexor = 0; column_Indexor < 8; column_Indexor++) {
    //      const firstElementElement = column_Indexor == 0 ? true : false;
    //      const lastElement =
    //            column_Indexor == thePlanningToReduce[0].length - 1 ? true : false;
    //
    //        let thePlanningToReduce_2 = JSON.parse(JSON.stringify(thePlanningToReduce));
    //
    //
    //
    //
    //        let copyPlanningToRe = toBeloweFunction_many(
    //          JSON.parse(JSON.stringify(thePlanningToReduce_2)),
    //          index,
    //          columnIndex
    //          ,'left'
    //        );
    //        if(copyPlanningToRe){
    //          return thePlanningToReduce_2;
    //        }
    //    }
    //  }
    //}

    return null;
  }

  //TRY TO BELOW MANY-----------------------------------------------------------------------------------
  function toBeloweFunction_many(
    thePlanningToReduce_,
    index_,
    columnIndex_,
    missinOne
  ) {
    const firstElementElement = columnIndex_ == 0 ? true : false;
    const lastElement =
      columnIndex_ == thePlanningToReduce_[0].length - 1 ? true : false;
    let thePlanningToReduce_2 = JSON.parse(
      JSON.stringify(thePlanningToReduce_)
    );
    if (!firstElementElement && !lastElement) {
      let currentRow = thePlanningToReduce_2[index_].slice(0, columnIndex_);
      let currentRow_2 = thePlanningToReduce_2[index_].slice(
        columnIndex_ + 1,
        thePlanningToReduce_[0].length
      );

      for (let index = 1; index < thePlanningToReduce_2.length; index++) {
        if (index_ != index) {
          let tryToBelowMany_row_rst = tryToBelowMany_row(
            thePlanningToReduce_,
            index_,
            index,
            currentRow,
            0
          );

          if (tryToBelowMany_row_rst) {

            for (
              let index_2 = 1;
              index_2 < thePlanningToReduce_2.length;
              index_2++
            ) {
              if (index_ != index_2) {
                let tryToBelowMany_row_rst_2 = tryToBelowMany_row(
                  tryToBelowMany_row_rst,
                  index_,
                  index_2,
                  currentRow_2,
                  columnIndex_ + 1
                );
                if (tryToBelowMany_row_rst_2) {
                  for (
                    let last_index = 1;
                    last_index < tryToBelowMany_row_rst_2.length;
                    last_index++
                  ) {
                    if (
                      canBeInserted3(
                        tryToBelowMany_row_rst_2[last_index],
                        missinOne,
                        columnIndex_
                      )
                    ) {
                      tryToBelowMany_row_rst_2[last_index][columnIndex_] =
                        missinOne;
                      return tryToBelowMany_row_rst_2;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else if (firstElementElement) {
      let currentRow_2 = thePlanningToReduce_2[index_].slice(
        columnIndex_ + 1,
        thePlanningToReduce_2[0].length
      );

      for (let index_2 = 1; index_2 < thePlanningToReduce_2.length; index_2++) {
        if (index_ != index_2) {
          let tryToBelowMany_row_rst_2 = tryToBelowMany_row(
            thePlanningToReduce_2,
            index_,
            index_2,
            currentRow_2,
            columnIndex_ + 1
          );
          if (tryToBelowMany_row_rst_2) {
            for (
              let last_index = 1;
              last_index < tryToBelowMany_row_rst_2.length;
              last_index++
            ) {
              if (
                canBeInserted3(
                  tryToBelowMany_row_rst_2[last_index],
                  missinOne,
                  columnIndex_
                )
              ) {
                tryToBelowMany_row_rst_2[last_index][columnIndex_] = missinOne;
                return tryToBelowMany_row_rst_2;
              }
            }
          }
        }
      }
    } else if (lastElement) {
      let currentRow = thePlanningToReduce_2[index_].slice(0, columnIndex_);
      for (let index = 1; index < thePlanningToReduce_2.length; index++) {
        if (index_ != index) {
          let tryToBelowMany_row_rst = tryToBelowMany_row(
            thePlanningToReduce_2,
            index_,
            index,
            currentRow,
            0
          );

          if (tryToBelowMany_row_rst) {

            for (
              let last_index = 1;
              last_index < tryToBelowMany_row_rst.length;
              last_index++
            ) {
              if (
                canBeInserted3(
                  tryToBelowMany_row_rst[last_index],
                  missinOne,
                  columnIndex_
                )
              ) {

                tryToBelowMany_row_rst[last_index][columnIndex_] = missinOne;
                return tryToBelowMany_row_rst;
              }
            }
          }
        }
      }
    }

    return null;
  }
  //TRY TO BELOW MANY ROWS---------------------------------------------------------------------------------------
  function tryToBelowMany_row(
    thePlanningToReduce_,
    OldIndex,
    newIndex,
    currentRow,
    column
  ) {
    let tryRst = false;
    let thePlanningToReduce_2 = JSON.parse(
      JSON.stringify(thePlanningToReduce_)
    );

    if (column == 0) {
      let toChangeRow = thePlanningToReduce_2[newIndex].slice(
        column,
        currentRow.length
      );
      for (
        let eraseIndex = column;
        eraseIndex < column + currentRow.length;
        eraseIndex++
      ) {
        thePlanningToReduce_2[OldIndex][eraseIndex] = "-";
        thePlanningToReduce_2[newIndex][eraseIndex] = "-";
      }
      for (
        let addIndex = column;
        addIndex < column + currentRow.length;
        addIndex++
      ) {
        thePlanningToReduce_2[OldIndex][addIndex] = "-";
        thePlanningToReduce_2[newIndex][addIndex] = "-";
        let newHolderCanBe =
          toChangeRow[addIndex] == "-"
            ? true
            : canBeInserted3(
              thePlanningToReduce_2[OldIndex],
              toChangeRow[addIndex],
              addIndex
            );
        let newHolderCanBe_2 =
          currentRow[addIndex] == "-"
            ? true
            : canBeInserted3(
              thePlanningToReduce_2[newIndex],
              currentRow[addIndex],
              addIndex
            );
        if (newHolderCanBe && newHolderCanBe_2) {
          thePlanningToReduce_2[OldIndex][addIndex] = toChangeRow[addIndex];
          thePlanningToReduce_2[newIndex][addIndex] = currentRow[addIndex];
        } else {
          return null;
        }
      }
    } else {
      let toChangeRow = thePlanningToReduce_2[newIndex].slice(
        column,
        thePlanningToReduce_2[0].length
      );
      for (
        let eraseIndex = column;
        eraseIndex < thePlanningToReduce_2[0].length;
        eraseIndex++
      ) {
        thePlanningToReduce_2[OldIndex][eraseIndex] = "-";
        thePlanningToReduce_2[newIndex][eraseIndex] = "-";
      }
      for (
        let addIndex = column;
        addIndex < thePlanningToReduce_2[0].length;
        addIndex++
      ) {
        thePlanningToReduce_2[OldIndex][addIndex] = "-";
        thePlanningToReduce_2[newIndex][addIndex] = "-";
        let newHolderCanBe =
          toChangeRow[addIndex - column] == "-"
            ? true
            : canBeInserted3(
              thePlanningToReduce_2[OldIndex],
              toChangeRow[addIndex - column],
              addIndex
            );
        let newHolderCanBe_2 =
          currentRow[addIndex - column] == "-"
            ? true
            : canBeInserted3(
              thePlanningToReduce_2[newIndex],
              currentRow[addIndex - column],
              addIndex
            );

        if (newHolderCanBe && newHolderCanBe_2) {
          thePlanningToReduce_2[OldIndex][addIndex] =
            toChangeRow[addIndex - column];
          thePlanningToReduce_2[newIndex][addIndex] =
            currentRow[addIndex - column];
        } else {
          return null;
        }
      }
    }

    return thePlanningToReduce_2;
  }

  //MULTIPLE INSERTION-----------------------------------------------------------------------------------
  function multipleInsertion(thePlanning, stsListtoBegin) {
    let stsListToReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];
    let thePlanningToReduce = [...thePlanning];
    for (let outIndex = 0; outIndex < stsListToReduce.length; outIndex++) {
      const out = stsListToReduce[outIndex];
      for (
        let outIntervalIndex = 0;
        outIntervalIndex < out.intervals.length;
        outIntervalIndex++
      ) {
        const outInterval = out.intervals[outIntervalIndex];
        let hasBeenFound = false;
        let columnIndex = thePlanningToReduce[0].findIndex(
          (e) => e === outInterval
        );
        const firstElementElement = columnIndex == 0 ? true : false;
        const lastElement =
          columnIndex == thePlanningToReduce[0].length - 1 ? true : false;

        let insertWithPillars_rst = insertWithPillars(
          thePlanningToReduce,
          columnIndex,
          out.matricule
        );
        if (insertWithPillars_rst != null) {
          thePlanningToReduce = JSON.parse(
            JSON.stringify(insertWithPillars_rst)
          );
          hasBeenFound = true;
        }

        if (hasBeenFound) {
          break;
        }
      }
    }

    return {
      thePlanning: thePlanningToReduce,
      stsListtoBegin: stsListToReduce,
    };
  }

  function forceInsertion(thePlanning, stsListtoBegin) {
    let inserted = false;

    let stsListtoReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];
    let stsListtoReduceToPass = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];

    let thePlanningToReduce = [...thePlanning.map((e) => e)];
    let thePlanningToReduce2 = [...thePlanning.map((e) => e)];
    for (let STSIndex = 0; STSIndex < stsListtoReduce.length; STSIndex++) {
      for (
        let intervalndex = 0;
        intervalndex < stsListtoReduce[STSIndex].intervals.length;
        intervalndex++
      ) {
        let columnIndex = -1;
        for (let index = 0; index < shift.length; index++) {
          if (
            shift[index] == stsListtoReduce[STSIndex].intervals[intervalndex]
          ) {
            columnIndex = index;
          }
        }
        if (columnIndex != -1) {
          for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let stsOldOne = thePlanningToReduce[rowIndex][columnIndex] + "";
            let thePlanningtoReduceCopy = [...thePlanningToReduce];
            if (
              !inserted &&
              canBeInserted(
                thePlanningtoReduceCopy[rowIndex],
                stsListtoReduce[STSIndex].matricule,
                columnIndex
              )
            ) {
              thePlanningtoReduceCopy[rowIndex][columnIndex] =
                stsListtoReduce[STSIndex].matricule;
              let stsListtoReduceCopy = [...stsListtoReduce];
              stsListtoReduceCopy = switchThisHours(
                stsListtoReduce,
                stsListtoReduce[STSIndex].matricule,
                stsOldOne,
                columnIndex
              );
              stsListtoReduceToPass = [...stsListtoReduceCopy];
              thePlanningToReduce[rowIndex][columnIndex] =
                stsListtoReduce[STSIndex].matricule;
              inserted = true;
              break;
            }
          }
        }
      }
    }
    return {
      inserted: inserted,
      thePlanningToReduce2: thePlanningToReduce2,
      stsListtoReduceToPass: stsListtoReduceToPass,
    };
  }
  function findMissingHours3(stsList, driversPlanning) {
    const intervalIndices = driversPlanning[0].reduce(
      (acc, interval, index) => {
        acc[interval] = index;
        return acc;
      },
      {}
    );

    const planningMap = driversPlanning.slice(1).reduce((acc, row) => {
      row.forEach((sts, index) => {
        if (sts !== "-") {
          if (!acc[sts]) {
            acc[sts] = new Set();
          }
          acc[sts].add(driversPlanning[0][index]);
        }
      });
      return acc;
    }, {});

    return stsList
      .map((sts) => {
        const assignedIntervals = planningMap[sts.matricule] || new Set();
        const intervals = sts.intervals.filter(
          (interval) => !assignedIntervals.has(interval)
        );
        return { matricule: sts.matricule, intervals };
      })
      .filter((e) => e.intervals.length > 0);
  }
  function findMissingHours2(stsList, driversPlanning) {
    const intervalIndices = driversPlanning[0].reduce(
      (acc, interval, index) => {
        acc[interval] = index;
        return acc;
      },
      {}
    );

    const planningMap = driversPlanning.slice(1).reduce((acc, row) => {
      row.forEach((sts, index) => {
        if (sts !== "-") {
          if (!acc[sts]) {
            acc[sts] = new Set();
          }
          acc[sts].add(driversPlanning[0][index]);
        }
      });
      return acc;
    }, {});

    return stsList.map((sts) => {
      const assignedIntervals = planningMap[sts.matricule] || new Set();
      const intervals = sts.intervals.filter(
        (interval) => !assignedIntervals.has(interval)
      );
      return { matricule: sts.matricule, intervals };
    });
  }
  function lastLayer(thePlanning, stsListtoBegin) {
    let stsListToReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];
    let thePlanningToReduce = [...thePlanning];
    for (let outIndex = 0; outIndex < stsListToReduce.length; outIndex++) {
      const out = stsListToReduce[outIndex];
      for (
        let outIntervalIndex = 0;
        outIntervalIndex < out.intervals.length;
        outIntervalIndex++
      ) {
        const outInterval = out.intervals[outIntervalIndex];
        let hasBeenFound = false;
        let columnIndex = thePlanningToReduce[0].findIndex(
          (e) => e === outInterval
        );
        const firstElementElement = columnIndex == 0 ? true : false;
        const lastElement =
          columnIndex == thePlanningToReduce[0].length - 1 ? true : false;

        for (let index2 = 1; index2 < thePlanningToReduce.length; index2++) {
          let copyPlanningToRe_1 = JSON.parse(
            JSON.stringify(thePlanningToReduce)
          );
          let copyPlanningToRe_2 = toBeloweFunction(
            JSON.parse(JSON.stringify(thePlanningToReduce)),
            index2,
            columnIndex
          );
          //const toMimicElement =
          //  thePlanningToReduce[tryToBeloweIndex][columnIndex];

          copyPlanningToRe_1[index2][columnIndex] = "-";

          if (
            canBeInserted(
              copyPlanningToRe_1[index2],
              out.matricule,
              columnIndex
            ) &&
            copyPlanningToRe_2 != null
          ) {
            copyPlanningToRe_2[index2][columnIndex] = out.matricule;
            thePlanningToReduce = JSON.parse(
              JSON.stringify(copyPlanningToRe_2)
            );
            hasBeenFound = true;
          } else if (
            canBeInserted2(
              thePlanningToReduce[index2],
              out.matricule,
              columnIndex
            )
          ) {
            copyPlanningToRe_1[index2][columnIndex] = out.matricule;
            thePlanningToReduce = JSON.parse(
              JSON.stringify(copyPlanningToRe_1)
            );
            hasBeenFound = true;
          }

          if (hasBeenFound) {
            break;
          }
        }
        if (hasBeenFound) {
          break;
        }
      }
    }
    return {
      thePlanningToReduce: thePlanningToReduce,
      stsListToReduce: stsListToReduce,
    };
  }
  function lastLayer2(thePlanning, stsListtoBegin) {
    let stsListToReduce = [
      ...stsListtoBegin.filter((e) => e.intervals.length > 0),
    ];
    let thePlanningToReduce = [...thePlanning];
    for (let outIndex = 0; outIndex < stsListToReduce.length; outIndex++) {
      const out = stsListToReduce[outIndex];
      for (
        let outIntervalIndex = 0;
        outIntervalIndex < out.intervals.length;
        outIntervalIndex++
      ) {
        const outInterval = out.intervals[outIntervalIndex];
        let hasBeenFound = false;
        let columnIndex = thePlanningToReduce[0].findIndex(
          (e) => e === outInterval
        );
        const firstElementElement = columnIndex == 0 ? true : false;
        const lastElement =
          columnIndex == thePlanningToReduce[0].length - 1 ? true : false;

        if (firstElementElement) {
          for (let index2 = 1; index2 < thePlanningToReduce.length; index2++) {
            let copyPlanningToRe_2 = toBeloweFunction(
              JSON.parse(JSON.stringify(thePlanningToReduce)),
              index2,
              columnIndex + 1
            );

            let canBe2 = false;
            if (copyPlanningToRe_2)
              canBe2 = canBeInserted(
                copyPlanningToRe_2[index2],
                out.matricule,
                columnIndex
              );

            if (copyPlanningToRe_2 != null && canBe2) {
              copyPlanningToRe_2[index2][columnIndex] = out.matricule;
              thePlanningToReduce = JSON.parse(
                JSON.stringify(copyPlanningToRe_2)
              );
              stsListtoBegin = findMissingHours3(
                stsListtoBegin,
                copyPlanningToRe_2
              );

              hasBeenFound = true;
            }

            if (hasBeenFound) {
              break;
            }
          }
        } else if (lastElement) {
          for (let index2 = 1; index2 < thePlanningToReduce.length; index2++) {
            let copyPlanningToRe_1 = toBeloweFunction(
              JSON.parse(JSON.stringify(thePlanningToReduce)),
              index2,
              columnIndex - 1
            );

            let canBe1 = false;
            if (copyPlanningToRe_1)
              canBe1 = canBeInserted(
                copyPlanningToRe_1[index2],
                out.matricule,
                columnIndex
              );

            if (copyPlanningToRe_1 != null && canBe1) {
              copyPlanningToRe_1[index2][columnIndex] = out.matricule;
              thePlanningToReduce = JSON.parse(
                JSON.stringify(copyPlanningToRe_1)
              );
              stsListtoBegin = findMissingHours3(
                stsListtoBegin,
                copyPlanningToRe_1
              );
              hasBeenFound = true;
            }

            if (hasBeenFound) {
              break;
            }
          }
        } else {
          for (let index2 = 1; index2 < thePlanningToReduce.length; index2++) {
            let copyPlanningToRe_1 = toBeloweFunction(
              JSON.parse(JSON.stringify(thePlanningToReduce)),
              index2,
              columnIndex - 1
            );

            let copyPlanningToRe_2 = toBeloweFunction(
              JSON.parse(JSON.stringify(thePlanningToReduce)),
              index2,
              columnIndex + 1
            );

            let canBe1 = false;
            if (copyPlanningToRe_1)
              canBe1 = canBeInserted(
                copyPlanningToRe_1[index2],
                out.matricule,
                columnIndex
              );

            let canBe2 = false;
            if (copyPlanningToRe_2)
              canBe2 = canBeInserted(
                copyPlanningToRe_2[index2],
                out.matricule,
                columnIndex
              );

            if (copyPlanningToRe_1 != null && canBe1) {
              copyPlanningToRe_1[index2][columnIndex] = out.matricule;
              thePlanningToReduce = JSON.parse(
                JSON.stringify(copyPlanningToRe_1)
              );
              stsListtoBegin = findMissingHours3(
                stsListtoBegin,
                copyPlanningToRe_1
              );
              hasBeenFound = true;
            } else if (copyPlanningToRe_2 != null && canBe2) {
              copyPlanningToRe_2[index2][columnIndex] = out.matricule;
              thePlanningToReduce = JSON.parse(
                JSON.stringify(copyPlanningToRe_2)
              );
              stsListtoBegin = findMissingHours3(
                stsListtoBegin,
                copyPlanningToRe_2
              );

              hasBeenFound = true;
            }

            if (hasBeenFound) {
              break;
            }
          }
        }
        if (hasBeenFound) {
          break;
        }
      }
    }

    return {
      thePlanningToReduce: thePlanningToReduce,
      stsListToReduce: stsListToReduce,
    };
  }
  function toBeloweFunction2(thePlanningToReduce_, index_, columnIndex_) {
    let copyPlanningToRe_1 = JSON.parse(JSON.stringify(thePlanningToReduce_));
    for (let index = 1; index < copyPlanningToRe_1.length; index++) {
      if (index != index_) {
        if (
          canBeInserted(
            copyPlanningToRe_1[index],
            copyPlanningToRe_1[index_][columnIndex_],
            columnIndex_
          ) &&
          countWH(copyPlanningToRe_1[index]) < 8 - numberOfBreaks
        ) {
          copyPlanningToRe_1[index][columnIndex_] =
            copyPlanningToRe_1[index_][columnIndex_];
          copyPlanningToRe_1[index_][columnIndex_] = "-";
        }
      }
    }
    return null;
  }
  function toBeloweFunction(thePlanningToReduce_, index_, columnIndex_) {
    let copyPlanningToRe_1 = JSON.parse(JSON.stringify(thePlanningToReduce_));
    for (let index = 1; index < copyPlanningToRe_1.length; index++) {
      if (index != index_) {
        if (
          canBeInserted3(
            copyPlanningToRe_1[index],
            copyPlanningToRe_1[index_][columnIndex_],
            columnIndex_
          )
        ) {
          if (countWH(copyPlanningToRe_1[index]) < 8 - numberOfBreaks + 1) {
            copyPlanningToRe_1[index][columnIndex_] =
              copyPlanningToRe_1[index_][columnIndex_];
            copyPlanningToRe_1[index_][columnIndex_] = "-";
            return copyPlanningToRe_1;
          } else {
            let driverBeenReduceotPlanning = null;
            for (let clColumnIndex = 0; clColumnIndex < 8; clColumnIndex++) {
              if (clColumnIndex != columnIndex_) {
                for (
                  let index_2 = 1;
                  index_2 < copyPlanningToRe_1.length;
                  index_2++
                ) {
                  if (index != index_2) {
                    driverBeenReduceotPlanning = JSON.parse(
                      JSON.stringify(copyPlanningToRe_1)
                    );

                    let canBe = canBeInserted3(
                      copyPlanningToRe_1[index_2],
                      copyPlanningToRe_1[index][clColumnIndex],
                      clColumnIndex
                    );
                    if (canBe) {
                      copyPlanningToRe_1[index][columnIndex_] =
                        copyPlanningToRe_1[index_][columnIndex_];
                      copyPlanningToRe_1[index_][columnIndex_] = "-";

                      copyPlanningToRe_1[index_2][clColumnIndex] =
                        copyPlanningToRe_1[index][clColumnIndex];
                      copyPlanningToRe_1[index][clColumnIndex] = "-";
                      return copyPlanningToRe_1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return null;
  }
  function balanceTheWH_FEQUP(thePlanning) {
    console.table(thePlanning)
    for (let index = 0; index < thePlanning.length; index++) {
      let mustWork = getDriverinalWOrkingHours(index);
      if(index==1){

        console.log("dkhl",countWH(thePlanning[index]))
      }
      if (countWH_2(thePlanning[index]) < mustWork) {

        for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
          if (thePlanning[index][columnIndex] == "-") {
            for (
              let last_index = 0;
              last_index < thePlanning.length;
              last_index++
            ) {
              if (
                index != last_index &&
                thePlanning[last_index][columnIndex] != "-" &&
                countWH(thePlanning[last_index])-1 > mustWork
              ) {
                if (
                  canBeInserted3(
                    thePlanning[index],
                    thePlanning[last_index][columnIndex],
                    columnIndex
                  )
                ) {
                  thePlanning[index][columnIndex] =
                    thePlanning[last_index][columnIndex];
                  thePlanning[last_index][columnIndex] = "-";
                  return thePlanning;
                }
              }
            }
          }
        }
      }
    }
    return thePlanning;
  }
  function balanceTheWH(thePlanning) {
    for (let index = 1; index < thePlanning.length; index++) {
      let mustWork = getDriverinalWOrkingHours(index);
      if (countWH(thePlanning[index]) < mustWork) {
        for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
          if (thePlanning[index][columnIndex] == "-") {
            for (
              let last_index = 1;
              last_index < thePlanning.length;
              last_index++
            ) {
              if (
                index != last_index &&
                thePlanning[last_index][columnIndex] != "-" &&
                countWH(thePlanning[last_index]) > mustWork
              ) {
                if (
                  canBeInserted3(
                    thePlanning[index],
                    thePlanning[last_index][columnIndex],
                    columnIndex
                  )
                ) {
                  thePlanning[index][columnIndex] =
                    thePlanning[last_index][columnIndex];
                  thePlanning[last_index][columnIndex] = "-";
                  return thePlanning;
                }
              }
            }
          }
        }
      }
    }
    return thePlanning;
  }
  function sortMatrix(matrix) {
    // Helper function to calculate the key for sorting
    function sortingKey(row) {
      let firstDashIndex = row.findIndex((item) => item === "-");
      let afterDashElements = row
        .slice(firstDashIndex)
        .filter((item) => item !== "-")
        .join("");
      return `${firstDashIndex}-${afterDashElements}`;
    }

    // Sort the matrix rows based on the sorting key
    matrix.sort((a, b) => {
      let keyA = sortingKey(a);
      let keyB = sortingKey(b);
      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    });

    return matrix;
  }
  function insertWithPillars_fusion(thePlanningToReduce, index, index_origin, columnIndex, missinOne) {
    thePlanningToReduce[index_origin][columnIndex] = "-";
    let thePlanningToReduce_2 = JSON.parse(
      JSON.stringify(thePlanningToReduce)
    );
    if (canBeInserted2(thePlanningToReduce_2[index], missinOne, columnIndex)) {
      thePlanningToReduce_2[index][columnIndex] = missinOne;
      return thePlanningToReduce_2;
    }
    for (let column_Indexor = 0; column_Indexor < 8; column_Indexor++) {
      thePlanningToReduce_2 = JSON.parse(
        JSON.stringify(thePlanningToReduce)
      );

      const firstElementElement = column_Indexor == 0 ? true : false;
      const lastElement =
        column_Indexor == thePlanningToReduce[0].length - 1 ? true : false;


      let copyPlanningToRe = toBeloweFunction(
        JSON.parse(JSON.stringify(thePlanningToReduce_2)),
        index,
        column_Indexor
      );
      if (copyPlanningToRe && (firstElementElement || lastElement)) {

        if (canBeInserted2(copyPlanningToRe[index], missinOne, columnIndex)) {
          copyPlanningToRe[index][columnIndex] = missinOne;
          return copyPlanningToRe;
        }
      }
      else if (copyPlanningToRe && copyPlanningToRe[index][column_Indexor - 1] !=
        copyPlanningToRe[index][column_Indexor + 1]) {

        if (canBeInserted2(copyPlanningToRe[index], missinOne, columnIndex)) {
          copyPlanningToRe[index][columnIndex] = missinOne;
          return copyPlanningToRe;
        }
      }
    }


    return null;
  }
  function findCouple(thePlanning, stsToCouple, index_, columnIndex) {
    let thePlanning_rst = [];
    for (let index = 1; index < thePlanning.length; index++) {

      if (columnIndex == 0 && thePlanning[index][columnIndex + 1] == stsToCouple) {
        let found = JSON.parse(JSON.stringify(thePlanning[index_]));
        let tbl = JSON.parse(JSON.stringify(thePlanning[index]));
        tbl = [shift, found, tbl];
        let rst = insertWithPillars_fusion(JSON.parse(JSON.stringify(thePlanning)), index, index_, columnIndex, stsToCouple);
        if (rst) {
          thePlanning_rst.push(JSON.parse(JSON.stringify(rst)));
        }
      } else if (columnIndex == 7 && thePlanning[index][columnIndex - 1] == stsToCouple) {
        let found = JSON.parse(JSON.stringify(thePlanning[index_]));
        let tbl = JSON.parse(JSON.stringify(thePlanning[index]));
        tbl = [shift, found, tbl];
        let rst = insertWithPillars_fusion(JSON.parse(JSON.stringify(thePlanning)), index, index_, columnIndex, stsToCouple);
        if (rst) {
          thePlanning_rst.push(JSON.parse(JSON.stringify(rst)));
        }
      } else if (
        (thePlanning[index][columnIndex + 1] == stsToCouple && thePlanning[index][columnIndex - 1] == '-') ||
        (thePlanning[index][columnIndex - 1] == stsToCouple && thePlanning[index][columnIndex + 1] == '-')
      ) {
        let found = JSON.parse(JSON.stringify(thePlanning[index_]));
        let tbl = JSON.parse(JSON.stringify(thePlanning[index]));
        tbl = [shift, found, tbl];
        let rst = insertWithPillars_fusion(JSON.parse(JSON.stringify(thePlanning)), index, index_, columnIndex, stsToCouple);
        if (rst) {
          thePlanning_rst.push(JSON.parse(JSON.stringify(rst)));
        }
      }

    }
    if (thePlanning_rst.length > 0) {
      // Sort thePlanning_rst based on the countSingles function
      thePlanning_rst.sort((a, b) => {
        return countSingles(a) - countSingles(b);
      });

      // After sorting, you can log the sorted elements
      for (let index_forrst = 0; index_forrst < thePlanning_rst.length; index_forrst++) {
        const element = thePlanning_rst[index_forrst];
        let count = countSingles(element);
      }
      return thePlanning_rst[0];
    }
    return thePlanning;
  }
  function countSingles(ThePlanning) {
    let count = 0;
    for (let index = 1; index < ThePlanning.length; index++) {
      for (let index2 = 0; index2 < 8; index2++) {
        if (ThePlanning[index][index2] != '-') {
          if (index2 == 0 && ThePlanning[index][index2 + 1] == '-') {
            count++;
          }
          else if (index2 == 7 && ThePlanning[index][index2 - 1] == '-') {
            count++;
          }
          else if (ThePlanning[index][index2 + 1] == '-' && ThePlanning[index][index2 - 1] == '-') {
            count++;
          }

        }
      }

    }
    return count;
  }
  function fusion_hours(thePlanning) {
    for (let index = 1; index < thePlanning.length; index++) {


      for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
        if (thePlanning[index][columnIndex] != "-") {
          if (columnIndex == 0 && thePlanning[index][columnIndex + 1] == "-") {

            thePlanning = findCouple(JSON.parse(JSON.stringify(thePlanning)), thePlanning[index][columnIndex], index, columnIndex);

          } else if (columnIndex == 7 && thePlanning[index][columnIndex - 1] == "-") {

            thePlanning = findCouple(JSON.parse(JSON.stringify(thePlanning)), thePlanning[index][columnIndex], index, columnIndex);
          } else if (
            thePlanning[index][columnIndex + 1] == "-" &&
            thePlanning[index][columnIndex - 1] == "-"
          ) {

            thePlanning = findCouple(JSON.parse(JSON.stringify(thePlanning)), thePlanning[index][columnIndex], index, columnIndex);
          }
        }
      }
    }
    return thePlanning;
  }
  function setAllDriversPlanning() {
    let thePlanning = [];
    let stsListtoBegin = JSON.parse(JSON.stringify(stsList));

    for (let driverIndex = 0; driverIndex < rows; driverIndex++) {
      let res = setOneDriverPlanning(stsListtoBegin, driverIndex);
      thePlanning.push(res.oneDriverPlanning);
      stsListtoBegin = [...res.stsPlanning];
      thePlanning = thePlanning.sort((a, b) => {
        return (
          b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
        );
      });
    }
    thePlanning = thePlanning.sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });
    thePlanning.unshift(shift);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
    thePlanning = thePlanning.slice(1);
    let rst = bestEnhancement([...thePlanning], [...stsListtoBegin]);
    thePlanning = [...rst.thePlanningToReduce];
    stsListtoBegin = [...rst.stsListToReduce];
    rst.thePlanningToReduce = rst.thePlanningToReduce.sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });

    for (let index = 0; index < 10; index++) {
      thePlanning = thePlanning.sort((a, b) => {
        return (
          b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
        );
      });
      let rsssst = bestEnhancement([...thePlanning], [...stsListtoBegin]);
      thePlanning = [...rsssst.thePlanningToReduce];
      stsListtoBegin = [...rsssst.stsListToReduce];
    }

    //let rst2 = forceInsertion2([...thePlanning], [...stsListtoBegin]);
    //rst2.thePlanning = rst2.thePlanning.sort((a, b) => {
    //  return (
    //    b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
    //  );
    //});
    //thePlanning = [...rst2.thePlanning];
    //stsListtoBegin = [...rst2.stsListtoBegin];

    thePlanning.unshift(shift);

    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    if (stsListtoBegin.length > 0) {
      let lastLayerResult = lastLayer([...thePlanning], [...stsListtoBegin]);
      for (let index = 0; index < 10; index++) {
        lastLayerResult = lastLayer([...thePlanning], [...stsListtoBegin]);
        thePlanning = [...lastLayerResult.thePlanningToReduce];
        stsListtoBegin = [...lastLayerResult.stsListToReduce];

        stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
      }
    }
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    //lastLayer2
    if (stsListtoBegin.length > 0) {
      let lastLayerResult2 = lastLayer2([...thePlanning], [...stsListtoBegin]);
      for (let index = 0; index < 20; index++) {
        lastLayerResult2 = lastLayer2([...thePlanning], [...stsListtoBegin]);
        thePlanning = [...lastLayerResult2.thePlanningToReduce];
        thePlanning = thePlanning.slice(1).sort((a, b) => {
          return (
            b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
          );
        });
        thePlanning.unshift(shift);
        stsListtoBegin = [...lastLayerResult2.stsListToReduce];

        stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
      }
    }
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);


    let rst2 = null;
    if (stsListtoBegin.length > 0) {
      for (let index = 0; index < 10; index++) {
        rst2 = simpleInsertion([...thePlanning], [...stsListtoBegin]);
        rst2.thePlanning = rst2.thePlanning.slice(1).sort((a, b) => {
          return (
            b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
          );
        });
        rst2.thePlanning.unshift(shift);
        thePlanning = [...rst2.thePlanning];
        stsListtoBegin = [...rst2.stsListtoBegin];
        stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
      }
    }
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    let supeLayer = null;
    if (stsListtoBegin.length > 0) {
      //for (let index = 0; index < 10; index++) {
      supeLayer = multipleInsertion([...thePlanning], [...stsListtoBegin]);
      supeLayer.thePlanning = supeLayer.thePlanning.slice(1).sort((a, b) => {
        return (
          b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
        );
      });
      supeLayer.thePlanning.unshift(shift);
      thePlanning = [...supeLayer.thePlanning];
      stsListtoBegin = [...supeLayer.stsListtoBegin];
      stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
      //}
    }
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    thePlanning = thePlanning.slice(1).sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });
    thePlanning.unshift(shift);
    thePlanning = balanceTheWH(JSON.parse(JSON.stringify(thePlanning)));
    thePlanning = thePlanning.slice(1).sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });
    thePlanning.unshift(shift);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    thePlanning = sortMatrix(JSON.parse(JSON.stringify(thePlanning)).slice(1));
    thePlanning.unshift(shift);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);
    for (let index = 0; index < 3; index++) {
      thePlanning = fusion_hours(JSON.parse(JSON.stringify(thePlanning)));
      thePlanning = sortMatrix(JSON.parse(JSON.stringify(thePlanning)).slice(1));
      thePlanning.unshift(shift);
    }
    thePlanning = thePlanning.slice(1).sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });
    thePlanning.unshift(shift);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);


    thePlanning = sortMatrix(JSON.parse(JSON.stringify(thePlanning)).slice(1));
    thePlanning.unshift(shift);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);

    thePlanning = thePlanning.slice(1).sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });
    thePlanning = balanceTheWH_FEQUP(JSON.parse(JSON.stringify(thePlanning)));
    thePlanning.unshift(shift);

    thePlanning = sortMatrix(JSON.parse(JSON.stringify(thePlanning)).slice(1));
    thePlanning.unshift(shift);
    stsListtoBegin = findMissingHours3(stsListtoBegin, thePlanning);


    thePlanning = thePlanning.slice(1).sort((a, b) => {
      return (
        b.filter((e) => e == "-").length - a.filter((e) => e == "-").length
      );
    });
    thePlanning.unshift(shift);
    return {
      thePlanning: thePlanning,
      stsListtoBegin: stsListtoBegin,
    };
  }
  let output = setAllDriversPlanning();

  return output;
}
  },
};
</script>
<style scoped>
.main {
  background-color: white;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.notification-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
  /* Prevents interaction with the container */
}

.notification {
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  transition: all 1s ease, opacity 2s ease;
  opacity: 0;
  pointer-events: auto;
  height: 10px;
  padding-top: 3px;
  padding-bottom: 30px;
  min-width: 40%;
  margin-top: 11px;
  font-size: 17px;
  position: relative;
}

.notification.show {
  opacity: 1;
}

.notification.hide {
  opacity: 0;
}

.notification.sucess {
  background-color: rgba(48, 205, 124, 0.79);
}

.notification.Failed {
  background-color: rgb(205 48 48 / 79%);
}

.notification.Failed::after {
  content: "\F0D59";
  /* mdi-left-arrow icon */
  font-family: "Material Design Icons";
  /* Ensure this matches your mdi font family */
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  /* Adjust size as necessary */
  font-weight: 100 !important;
}

.notification.sucess::after {
  content: "\F0D59";
  /* mdi-left-arrow icon */
  font-family: "Material Design Icons";
  /* Ensure this matches your mdi font family */
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  /* Adjust size as necessary */
  font-weight: 100 !important;
}
</style>
