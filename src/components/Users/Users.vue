<template>
  <div class="parentContainer">
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
    <div class="container userContainer">
      <div class="searchContainer">
        <v-row>
          <v-col cols="8">
            <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
              hide-details single-line class="search" style="background-color: white"></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="addActions">
              <div>
                <v-btn style="background-color: #009688;" icon color="white" @click="resetWHShowfunction"
                  class="resetWHShowfunction">
                  <v-icon size="small">
                    mdi-clipboard-clock-outline
                  </v-icon>
                  <input type="file" ref="fileInput" style="display: none" accept=".xls,.xlsx"
                    @change="handleFileUpload">
                </v-btn>
              </div>
              <div>
                <v-btn icon color="white" @click="openFileDialog" class="importUsersButton">
                  <v-icon size="small">
                    mdi-upload
                  </v-icon>
                  <input type="file" ref="fileInput" style="display: none" accept=".xls,.xlsx"
                    @change="handleFileUpload">
                </v-btn>
              </div>
              <div class="addUserButtonStyle">
                <v-btn icon v-bind="props" color="white" class="addUserButton" @click="openAddUserDialog">
                  <v-icon size="small">
                    mdi-account-plus-outline
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <div
        style="width: 80%; margin: 0px auto; background-color: white; border-top-left-radius: 20px; border-top-right-radius: 20px;    border: 1px solid #0000001f;">
        <!-- Role Tabs -->
        <v-tabs v-model="activeRole" align-tabs="center" color="deep-purple-accent-4">
          <v-tab :key="-1">ALL ROLES</v-tab>
          <v-tab v-for="role in uniqueRoles" :key="-1">{{ role }}</v-tab>
        </v-tabs>
        <v-tabs-window v-model="activeRole">
          <v-tabs-window-item :key="-1" :value="-1"
            style="background-color: white; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;    border: 1px solid #0000001f;">
            <!-- Data Table for Each Role -->
            <v-data-table v-if="filteredUsers.length" v-model:expanded="expanded" :headers="headers"
              :items="filteredUsers" :search="search" class="table userTable" show-expand
              style="text-align: center; width: 100%; margin: 0 auto; min-height: 77vh; max-height: 77vh;">
              <!-- Expanded Row with Advanced Layout -->
              <!-- Custom Row Template -->
              <template v-slot:item="{ item, internalItem, toggleExpand, expaned, hh }">
                <tr @click="toggleExpand(internalItem); item.expanded = !item.expanded" class="usersTableRow"
                  :class="item.expanded ? 'usersTableRowSelected' : ''">
                  <td style="    padding-top: 14px;">
                    <!-- Custom rendering for the first column -->
                    <div class="custom-avatar">
                      <v-avatar size="40">
                        <v-img
                          :src="item.profile_picture ? 'http://127.0.0.1:8000/uploads/' + item.profile_picture : ''">
                          <template v-slot:placeholder>
                            <v-icon style="    color: #454592;" size="40">mdi-account-circle-outline</v-icon>
                          </template>
                        </v-img>

                      </v-avatar>
                    </div>
                  </td>



                  <td>
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.matricule?.toUpperCase() }} </span>
                  </td>

                  <td>
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.firstname?.toUpperCase() }} {{ item.lastname?.toUpperCase()
                      }}</span>
                  </td>

                  <td>
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.emai?.toLowerCase() }}</span>
                  </td>

                  <td>
                    <!-- Example: Displaying a badge or icon -->
                    <v-chip :color="item.isactive ? 'green' : 'red'" dark style="    width: 78px;">
                      {{ item.isactive ? 'ENABLE' : 'DISABLE' }}
                    </v-chip>
                  </td>


                </tr>
              </template>
              <template v-slot:expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length">
                    <v-card class="expanded-row-card" elevation="2" style=" margin-bottom: 14px; margin-top: 8px; ">
                      <v-container>
                        <v-row style="position: relative;">
                          <!-- User Avatar and Main Info -->
                          <v-col cols="5" class="text-center pr-3">
                            <v-avatar size="200" style="position: relative" class="addAvatarPic">
                              <span class="delete_pic"></span>
                              <span class="edit_pic"></span>
                              <v-img
                                :src="item.newImg ? item.newImg : 'http://127.0.0.1:8000/uploads/' + item.profile_picture">
                                <template v-slot:placeholder>
                                  <v-icon style="    color: #454592;" size="190">mdi-account-circle-outline</v-icon>
                                </template>
                              </v-img>
                              <span class="avatarChoosePic" v-if="item.edited">
                                <v-file-input hide-details @change="onFileChange($event, item)"
                                  class="avatarPicInput"></v-file-input>
                              </span>
                            </v-avatar>
                            <p><strong>{{ item.firstname.length > 1 ?
                              item.firstname[0].toUpperCase() + item.firstname.slice(1) : item.firstname }} {{
                                  item.lastname?.toUpperCase() }}</strong></p>
                            <v-chip :color="item.isactive ? 'green' : 'red'" dark>
                              {{ item.isactive ? 'Active' : 'Inactive' }}
                            </v-chip>

                            <v-row style="margin-top: 15px;">
                              <v-col class=" pa-0">

                                <v-list-item class="profileButtons pa-0" @click.stop="openShowResetUserConfirm(item)"
                                  prepend-icon="mdi-lock-reset" :title="'Reset Password'"
                                  style="background-color: rgb(255, 152, 0); color: white; border-radius: 24px !important; /* border-top-right-radius: 20px !important; */ padding-right: 45px; width: 69% !important; margin: 0 auto;margin-bottom: 3px;">

                                </v-list-item>
                              </v-col>
                              <v-col cols="12" class=" pa-0">



                                <v-list-item class="profileButtons pa-0" @click.stop="openShowDeleteUserConfirm(item)"
                                  prepend-icon="mdi-delete" :title="'DELETE'"
                                  style="background-color: #F44336; color: white; border-radius: 24px !important; /* border-top-right-radius: 20px !important; */ padding-right: 45px; width: 69% !important; margin: 0 auto;">
                                </v-list-item>


                              </v-col>

                            </v-row>
                          </v-col>

                          <!-- Tabs for Personal Info, Work Info, Status -->
                          <v-col cols="7"
                            style=" padding-top: 10px; background-color: #f4f4f4e8; border-radius: 15px; ">
                            <v-tabs v-model="activeTab" align-tabs="center" color="deep-purple-accent-4">
                              <v-tab :value="0">General Info</v-tab>
                              <v-tab :value="1">Work Info</v-tab>
                              <v-tab :value="2">Status</v-tab>

                              <div style="width:100%;text-align: right">
                                <v-btn icon @click="item.edited ? openShowEdidUserConfirm(item) : item.edited = true"
                                  style="margin-right: 10px;" :color="item.edited ? 'green darken-2' : 'blue darken-2'">
                                  <v-icon>{{ item.edited ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
                                </v-btn>
                                <v-btn icon v-if="item.edited" @click="item = resetItem(item)"
                                  :color="item.edited ? 'red darken-2' : 'blue darken-2'">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </div>

                            </v-tabs>

                            <!-- Tab Contents -->
                            <v-tabs-window v-model="activeTab">
                              <!-- Personal Info Tab -->
                              <v-tabs-window-item :value="0">
                                <v-container>
                                  <!-- Row for Matricule -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Matricule:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.matricule ? item.matricule : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.matricule" label="Matricule"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for First Name -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>First Name:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.firstname ? item.firstname.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.firstname" label="First Name"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Last Name -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Last Name:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.lastname ? item.lastname?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.lastname" label="Last Name"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Email -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Email:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.email ? item.email : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.email" label="Email" hide-details></v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-tabs-window-item>

                              <!-- Work Info Tab -->
                              <v-tabs-window-item :value="1">
                                <v-container>
                                  <!-- Row for Role -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Department:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.department.name ? item.department.name : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">

                                      <!-- Correct v-select usage -->
                                      <v-select v-model="item.department_id" :items="getDepartments" item-title="name"
                                        item-value="id" label="Department" hide-details></v-select>




                                    </v-col>
                                  </v-row>


                                  <!-- Row for Role -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Role:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.role.name ? item.role.name?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <!-- Correct v-select usage -->
                                      <v-select v-model="item.role_id"
                                        :items="getRoles.filter((e) => e.department_id == item?.department_id)"
                                        :item-title="toUpperCase('name')" item-value="id" label="Role"
                                        hide-details></v-select>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Shift -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Shift:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.shift?.category ? item.shift?.category?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-select v-model="item.shift_id" :items="getShifts"
                                        :item-title="toUpperCase('category')" item-value="id" label="Shift" hide-details
                                        clearable></v-select>

                                    </v-col>
                                  </v-row>

                                  <!-- Row for Equipment group -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Equipment Group:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.profile_group?.type ? item.profile_group?.type?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-select class="uppercase-text" v-model="item.profile_group_id"
                                        :items="getProfileGroups" :item-title="toUpperCase('type')" item-value="id"
                                        label="profile_group" hide-details clearable></v-select>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-tabs-window-item>

                              <!-- Status Tab -->
                              <v-tabs-window-item :value="2">
                                <v-container>
                                  <!-- Row for Working Hours -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Working Hours:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.workingHours ? item.workingHours : 0 }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field type="number" v-model="item.workingHours" label="Working Hours"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Standby Hours -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Standby Hours:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.sby_workingHours ? item.sby_workingHours : 0 }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field type="number" v-model="item.sby_workingHours" label="Standby Hours"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Global WH -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Global WH:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.wh_global ? item.wh_global : 0 }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field type="number" v-model="item.wh_global" label="Global WH"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Account Status -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Account Enabled:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      <v-chip color="green" text-color="white" v-if="item.isactive">Account
                                        Enabled</v-chip>
                                      <v-chip color="red" text-color="white" v-else>Account Disabled</v-chip>
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">

                                      <v-chip @click="item.isactive = true"
                                        :class="item.isactive ? 'selectedAccountStatus' : ''" color="green"
                                        text-color="white" style="margin-top: 13px; float: left;">
                                        Account Enabled
                                      </v-chip>

                                      <v-chip @click="item.isactive = false"
                                        :class="!item.isactive ? 'selectedAccountStatus' : ''" color="red"
                                        text-color="white" style="margin-top: 13px; float: left;">
                                        Account Disabled
                                      </v-chip>

                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-tabs-window-item>
                            </v-tabs-window>

                          </v-col>
                        </v-row>


                      </v-container>
                    </v-card>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tabs-window-item>
          <v-tabs-window-item v-for="role in uniqueRoles" :key="role" :value="role"
            style="background-color: white; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;    border: 1px solid #0000001f;">
            <!-- Data Table for Each Role -->
            <v-data-table v-if="filteredUsersByRole(role).length" v-model:expanded="expanded" :headers="role=='driver'?headers_driver:headers"
              :items="filteredUsersByRole(role)" :search="search" class="table userTable" show-expand
              style="text-align: center; width: 100%; margin: 0 auto; min-height: 77vh; max-height: 77vh;">
              <!-- Expanded Row with Advanced Layout -->
              <!-- Custom Row Template -->
              <template v-slot:item="{ item, internalItem, toggleExpand, expaned, hh }">
                <tr @click="toggleExpand(internalItem); item.expanded = !item.expanded" class="usersTableRow"
                  :class="item.expanded ? 'usersTableRowSelected' : ''">
                  <td style="    padding-top: 14px;">
                    <!-- Custom rendering for the first column -->
                    <div class="custom-avatar">
                      <v-avatar size="40">
                        <v-img
                          :src="item.profile_picture ? 'http://127.0.0.1:8000/uploads/' + item.profile_picture : ''">
                          <template v-slot:placeholder>
                            <v-icon style="    color: #454592;" size="40">mdi-account-circle-outline</v-icon>
                          </template>
                        </v-img>

                      </v-avatar>
                    </div>
                  </td>



                  <td>
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.matricule?.toUpperCase() }} </span>
                  </td>

                  <td>
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.firstname?.toUpperCase() }} {{ item.lastname?.toUpperCase()
                      }}</span>
                  </td>

                  <td v-if="role!='driver'">
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.emai?.toLowerCase() }}</span>
                  </td>
                  <td v-else>
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.shiftName?.toUpperCase() }}</span>
                  </td>
                  <td v-if="role=='driver'">
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.profile_groupName?.toUpperCase() }}</span>
                  </td>
                  <td v-if="role=='driver'">
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.workingHours?.toFixed(2) }}</span>
                  </td>
                  <td v-if="role=='driver'">
                    <!-- Example: Custom text transformation -->
                    <span class="custom-text">{{ item.wh_global?.toFixed(2) }}</span>
                  </td>
                  <td>
                    <!-- Example: Displaying a badge or icon -->
                    <v-chip :color="item.isactive ? 'green' : 'red'" dark style="    width: 78px;">
                      {{ item.isactive ? 'ENABLE' : 'DISABLE' }}
                    </v-chip>
                  </td>


                </tr>
              </template>
              <template v-slot:expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length">
                    <v-card class="expanded-row-card" elevation="2" style=" margin-bottom: 14px; margin-top: 8px; ">
                      <v-container>
                        <v-row style="position: relative;">
                          <!-- User Avatar and Main Info -->
                          <v-col cols="5" class="text-center pr-3">
                            <v-avatar size="200" style="position: relative" class="addAvatarPic">
                              <span class="delete_pic"></span>
                              <span class="edit_pic"></span>
                              <v-img
                                :src="item.newImg ? item.newImg : 'http://127.0.0.1:8000/uploads/' + item.profile_picture">
                                <template v-slot:placeholder>
                                  <v-icon style="    color: #454592;" size="190">mdi-account-circle-outline</v-icon>
                                </template>
                              </v-img>
                              <span class="avatarChoosePic" v-if="item.edited">
                                <v-file-input hide-details @change="onFileChange($event, item)"
                                  class="avatarPicInput"></v-file-input>
                              </span>
                            </v-avatar>
                            <p><strong>{{ item.firstname.length > 1 ?
                              item.firstname[0].toUpperCase() + item.firstname.slice(1) : item.firstname }} {{
                                  item.lastname?.toUpperCase() }}</strong></p>
                            <v-chip :color="item.isactive ? 'green' : 'red'" dark>
                              {{ item.isactive ? 'Active' : 'Inactive' }}
                            </v-chip>

                            <v-row style="margin-top: 15px;">
                              <v-col class=" pa-0">

                                <v-list-item class="profileButtons pa-0" @click.stop="openShowResetUserConfirm(item)"
                                  prepend-icon="mdi-lock-reset" :title="'Reset Password'"
                                  style="background-color: rgb(255, 152, 0); color: white; border-radius: 24px !important; /* border-top-right-radius: 20px !important; */ padding-right: 45px; width: 69% !important; margin: 0 auto;margin-bottom: 3px;">

                                </v-list-item>
                              </v-col>
                              <v-col cols="12" class=" pa-0">



                                <v-list-item class="profileButtons pa-0" @click.stop="openShowDeleteUserConfirm(item)"
                                  prepend-icon="mdi-delete" :title="'DELETE'"
                                  style="background-color: #F44336; color: white; border-radius: 24px !important; /* border-top-right-radius: 20px !important; */ padding-right: 45px; width: 69% !important; margin: 0 auto;">
                                </v-list-item>


                              </v-col>

                            </v-row>
                          </v-col>

                          <!-- Tabs for Personal Info, Work Info, Status -->
                          <v-col cols="7"
                            style=" padding-top: 10px; background-color: #f4f4f4e8; border-radius: 15px; ">
                            <v-tabs v-model="activeTab" align-tabs="center" color="deep-purple-accent-4">
                              <v-tab :value="0">General Info</v-tab>
                              <v-tab :value="1">Work Info</v-tab>
                              <v-tab :value="2">Status</v-tab>

                              <div style="width:100%;text-align: right">
                                <v-btn icon @click="item.edited ? openShowEdidUserConfirm(item) : item.edited = true"
                                  style="margin-right: 10px;" :color="item.edited ? 'green darken-2' : 'blue darken-2'">
                                  <v-icon>{{ item.edited ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
                                </v-btn>
                                <v-btn icon v-if="item.edited" @click="item = resetItem(item)"
                                  :color="item.edited ? 'red darken-2' : 'blue darken-2'">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </div>

                            </v-tabs>

                            <!-- Tab Contents -->
                            <v-tabs-window v-model="activeTab">
                              <!-- Personal Info Tab -->
                              <v-tabs-window-item :value="0">
                                <v-container>
                                  <!-- Row for Matricule -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Matricule:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.matricule ? item.matricule : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.matricule" label="Matricule"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for First Name -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>First Name:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.firstname ? item.firstname.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.firstname" label="First Name"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Last Name -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Last Name:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.lastname ? item.lastname?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.lastname" label="Last Name"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Email -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Email:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.email ? item.email : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field v-model="item.email" label="Email" hide-details></v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-tabs-window-item>

                              <!-- Work Info Tab -->
                              <v-tabs-window-item :value="1">
                                <v-container>
                                  <!-- Row for Role -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Department:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.department.name ? item.department.name : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">

                                      <!-- Correct v-select usage -->
                                      <v-select v-model="item.department_id" :items="getDepartments" item-title="name"
                                        item-value="id" label="Department" hide-details></v-select>




                                    </v-col>
                                  </v-row>


                                  <!-- Row for Role -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Role:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.role.name ? item.role.name?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <!-- Correct v-select usage -->
                                      <v-select v-model="item.role_id"
                                        :items="getRoles.filter((e) => e.department_id == item?.department_id)"
                                        :item-title="toUpperCase('name')" item-value="id" label="Role"
                                        hide-details></v-select>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Shift -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Shift:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.shift?.category ? item.shift?.category?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-select v-model="item.shift_id" :items="getShifts"
                                        :item-title="toUpperCase('category')" item-value="id" label="Shift" hide-details
                                        clearable></v-select>

                                    </v-col>
                                  </v-row>

                                  <!-- Row for Equipment group -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Equipment Group:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.profile_group?.type ? item.profile_group?.type?.toUpperCase() : 'Empty' }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-select class="uppercase-text" v-model="item.profile_group_id"
                                        :items="getProfileGroups" :item-title="toUpperCase('type')" item-value="id"
                                        label="profile_group" hide-details clearable></v-select>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-tabs-window-item>

                              <!-- Status Tab -->
                              <v-tabs-window-item :value="2">
                                <v-container>
                                  <!-- Row for Working Hours -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Working Hours:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.workingHours ? item.workingHours : 0 }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field type="number" v-model="item.workingHours" label="Working Hours"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Standby Hours -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Standby Hours:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.sby_workingHours ? item.sby_workingHours : 0 }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field type="number" v-model="item.sby_workingHours" label="Standby Hours"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Global WH -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Global WH:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      {{ item.wh_global ? item.wh_global : 0 }}
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">
                                      <v-text-field type="number" v-model="item.wh_global" label="Global WH"
                                        hide-details></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <!-- Row for Account Status -->
                                  <v-row>
                                    <v-col cols="3" class="profileAttrs">
                                      <strong>Account Enabled:</strong>
                                    </v-col>
                                    <v-col cols="9" v-if="!item.edited" class="profileAttrs">
                                      <v-chip color="green" text-color="white" v-if="item.isactive">Account
                                        Enabled</v-chip>
                                      <v-chip color="red" text-color="white" v-else>Account Disabled</v-chip>
                                    </v-col>
                                    <v-col cols="9" v-else class="profileAttrs_textbox">

                                      <v-chip @click="item.isactive = true"
                                        :class="item.isactive ? 'selectedAccountStatus' : ''" color="green"
                                        text-color="white" style="margin-top: 13px; float: left;">
                                        Account Enabled
                                      </v-chip>

                                      <v-chip @click="item.isactive = false"
                                        :class="!item.isactive ? 'selectedAccountStatus' : ''" color="red"
                                        text-color="white" style="margin-top: 13px; float: left;">
                                        Account Disabled
                                      </v-chip>

                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-tabs-window-item>
                            </v-tabs-window>

                          </v-col>
                        </v-row>


                      </v-container>
                    </v-card>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tabs-window-item>

        </v-tabs-window>
      </div>
    </div>
  </div>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="showEdidUserConfirm" max-width="600" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-lock-reset" title="EDIT PROFILE">
          <v-card-text>
            Are you sure you want to edit the profile : <span
              style=" font-size: 20px; font-weight: 700; color: #4CAF50; ">{{ user?.oldMat }} ?</span>
          </v-card-text>
          <template v-slot:actions>
            <v-btn style=" background-color: #808080c2; color: white !important;" @click="showEdidUserConfirm = false">
              NO
            </v-btn>
            <v-btn style=" background-color: #4CAF50; color: white !important;" @click="showEdidUserConfirmMethode">
              EDIT
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="showDeleteUserConfirm" max-width="600" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-delete-empty-outline" title="DELETE PROFILE">
          <v-card-text>
            Are you sure you want to delete the profile : <span
              style=" font-size: 20px; font-weight: 700; color:rgb(244, 67, 54); ">{{ user?.oldMat }} ?</span>
          </v-card-text>
          <template v-slot:actions>
            <v-btn style=" background-color: gray; color: white !important;" @click="showDeleteUserConfirm = false">
              NO
            </v-btn>
            <v-btn style=" background-color: rgb(244, 67, 54); color: white !important;" @click="deleteNew">
              DELETE
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="showResetUserConfirm" max-width="600" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-clipboard-clock-outline" title="RESET PASSWORD"
          color="">
          <v-card-text>
            Are you sure you want to reset the password for the the profile : <span
              style=" font-size: 20px; font-weight: 700; color: rgb(255, 152, 0); ">{{ user?.oldMat }} ?</span>
          </v-card-text>
          <template v-slot:actions>
            <v-btn style=" background-color: #808080c2; color: white !important;" @click="showResetUserConfirm = false">
              NO
            </v-btn>
            <v-btn style=" background-color: rgb(255, 152, 0); color: white !important;" @click="resetPasswordNew">
              RESET
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="addUserInterface_dialog" max-width="900" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-account-multiple-plus" title="ADD USER" color="">
          <v-card-text>
            <v-card class="expanded-row-card" elevation="2" style="margin-bottom: 14px; margin-top: 8px">
              <v-container>
                <v-row style="position: relative">
                  <v-col cols="12" class="text-center pr-3">
                    <v-avatar size="200" style="position: relative" class="addAvatarPic">
                      <span class="delete_pic"></span>
                      <span class="edit_pic"></span>
                      <v-img
                        :src="user_to_add.newImg ? user_to_add.newImg : 'http://127.0.0.1:8000/uploads/' + user_to_add.profile_picture">
                        <template v-slot:placeholder>
                          <v-icon style="color: #454592" size="190">mdi-account-circle-outline</v-icon>
                        </template>
                      </v-img>
                      <span class="avatarChoosePic">
                        <v-file-input hide-details @change="onFileChange_2($event, user_to_add)"
                          class="avatarPicInput"></v-file-input>
                      </span>
                    </v-avatar>
                    <p>
                      <strong>{{ user_to_add.firstname.length > 1 ? user_to_add.firstname[0].toUpperCase() +
                        user_to_add.firstname.slice(1) : user_to_add.firstname }} {{
                          user_to_add.lastname?.toUpperCase() }}</strong>
                    </p>
                    <v-chip :color="user_to_add.isactive ? 'green' : 'red'" dark>
                      {{ user_to_add.isactive ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" style=" padding-top: 10px; background-color: #f4f4f4e8; border-radius: 15px;">
                    <v-tabs v-model="activeTab_2" align-tabs="center" color="deep-purple-accent-4">
                      <v-tab :value="0">General Info</v-tab>
                      <v-tab :value="1">Work Info</v-tab>
                      <v-tab :value="2">Status</v-tab>
                    </v-tabs>
                    <!-- Tab Contents -->
                    <v-tabs-window v-model="activeTab_2">
                      <!-- Personal Info Tab -->
                      <v-tabs-window-item :value="0">
                        <v-container>
                          <!-- Row for Matricule -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Matricule:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-text-field v-model="user_to_add.matricule" label="Matricule"
                                hide-details></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Row for First Name -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>First Name:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-text-field v-model="user_to_add.firstname" label="First Name"
                                hide-details></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Row for Last Name -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Last Name:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-text-field v-model="user_to_add.lastname" label="Last Name"
                                hide-details></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Row for Email -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Email:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-text-field v-model="user_to_add.email" label="Email" hide-details></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-tabs-window-item>
                      <!-- Work Info Tab -->
                      <v-tabs-window-item :value="1">
                        <v-container>
                          <!-- Row for Role -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Department:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <!-- Correct v-select usage -->
                              <v-select v-model="user_to_add.department_id" :items="getDepartments" item-title="name"
                                item-value="id" label="Department" hide-details></v-select>
                            </v-col>
                          </v-row>
                          <!-- Row for Role -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Role:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <!-- Correct v-select usage -->
                              <v-select v-model="user_to_add.role_id"
                                :items="getRoles.filter((e) => e.department_id == user_to_add?.department_id)"
                                :item-title="toUpperCase('name')" item-value="id" label="Role" hide-details></v-select>
                            </v-col>
                          </v-row>
                          <!-- Row for Shift -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Shift:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-select v-model="user_to_add.shift_id" :items="getShifts"
                                :item-title="toUpperCase('category')" item-value="id" label="Shift" hide-details
                                clearable></v-select>
                            </v-col>
                          </v-row>
                          <!-- Row for Equipment group -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Equipment Group:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-select class="uppercase-text" v-model="user_to_add.profile_group_id"
                                :items="getProfileGroups" :item-title="toUpperCase('type')" item-value="id"
                                label="profile_group" hide-details clearable></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-tabs-window-item>
                      <!-- Status Tab -->
                      <v-tabs-window-item :value="2">
                        <v-container>
                          <!-- Row for Working Hours -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Working Hours:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-text-field type="number" v-model="user_to_add.workingHours" label="Working Hours"
                                hide-details></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Row for Standby Hours -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Standby Hours:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-text-field type="number" v-model="user_to_add.sby_workingHours" label="Standby Hours"
                                hide-details></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Row for Global WH -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Global WH:</strong>
                            </v-col>
                            <v-col cols="9" e class="profileAttrs_textbox">
                              <v-text-field type="number" v-model="user_to_add.wh_global" label="Global WH"
                                hide-details></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Row for Account Status -->
                          <v-row>
                            <v-col cols="3" class="profileAttrs">
                              <strong>Account Enabled:</strong>
                            </v-col>
                            <v-col cols="9" class="profileAttrs_textbox">
                              <v-chip @click="user_to_add.isactive = true"
                                :class="user_to_add.isactive ? 'selectedAccountStatus' : ''" color="green"
                                text-color="white" style="margin-top: 13px; float: left">
                                Account Enabled
                              </v-chip>
                              <v-chip @click="user_to_add.isactive = false"
                                :class="!user_to_add.isactive ? 'selectedAccountStatus' : ''" color="red"
                                text-color="white" style="margin-top: 13px; float: left">
                                Account Disabled
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-tabs-window-item>
                    </v-tabs-window>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-card-text>
          <template v-slot:actions>
            <v-btn style=" background-color: #808080c2; color: white !important;"
              @click="addUserInterface_dialog = false">
              CANCEL
            </v-btn>
            <v-btn style=" background-color: #3c57d2; color: white !important;" @click="addUserMethod_new">
              ADD
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="resetWHShow" max-width="1000" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-clipboard-clock-outline"
          text="Please select the teams to reset their WH:" title="WORKING HOURS">
          <v-card-text class="mb-0 pb-0">
            <div class="table-container">
  <table>
    <thead>
      <tr>
        <th>SHIFT</th>
        <th>RTG</th>
        <th>STS</th>
        <th>RS</th>
        <th>AM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>A</th>
        <td class="shiftWHselect">
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(1, 1).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(1, 1).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(1, 1).last.created_at ? find_WH_reset_row(1, 1).last.created_at : 'empty'
              }}</span>
          <span class="show_wh_details_reset">
            <v-btn :disabled="find_WH_reset_row(1, 1).min == 0 && find_WH_reset_row(1, 1).max == 0"
              @click="whResetCatalogueFunction(1, 1, 'RTG', 'A')" color="rgb(23 61 117)" class="text-white"
              prepend-icon="mdi-reload" size="small">RESET
            </v-btn>
          </span>
          <span class="show_wh_details">
            <v-btn @click="whReset_showDetails(1, 1, 'RTG', 'A')" color="#00000073" class="text-white"
              append-icon="mdi-clipboard-text-clock" size="small">DETAILS
            </v-btn>
          </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(2, 1).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(2, 1).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(2, 1).last.created_at ? find_WH_reset_row(2, 1).last.created_at : 'empty'
              }}</span>


              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(2, 1).min == 0 && find_WH_reset_row(2, 1).max == 0"
                  @click="whResetCatalogueFunction(2, 1, 'STS', 'A')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(2, 1, 'STS', 'A')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(3, 1).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(3, 1).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(3, 1).last.created_at ? find_WH_reset_row(3, 1).last.created_at : 'empty'
              }}</span>

              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(3, 1).min == 0 && find_WH_reset_row(3, 1).max == 0"
                  @click="whResetCatalogueFunction(3, 1, 'RS', 'A')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(3, 1, 'RS', 'A')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(4, 1).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(4, 1).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(4, 1).last.created_at ? find_WH_reset_row(4, 1).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(4, 1).min == 0 && find_WH_reset_row(4, 1).max == 0"
                  @click="whResetCatalogueFunction(4, 1, 'AM', 'A')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(4, 1, 'AM', 'A')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


      </tr>
      <tr>
        <th>B</th>
        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(1, 2).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(1, 2).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(1, 2).last.created_at ? find_WH_reset_row(1, 2).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(1, 2).min == 0 && find_WH_reset_row(1, 2).max == 0"
                  @click="whResetCatalogueFunction(1, 2, 'RTG', 'B')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(1, 2, 'RTG', 'B')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect">
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(2, 2).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(2, 2).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(2, 2).last.created_at ? find_WH_reset_row(2, 2).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(2, 2).min == 0 && find_WH_reset_row(2, 2).max == 0"
                  @click="whResetCatalogueFunction(2, 2, 'STS', 'B')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(2, 2, 'STS', 'B')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(3, 2).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(3, 2).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(3, 2).last.created_at ? find_WH_reset_row(3, 2).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(3, 2).min == 0 && find_WH_reset_row(3, 2).max == 0"
                  @click="whResetCatalogueFunction(3, 2, 'RS', 'B')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(3, 2, 'RS', 'B')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(4, 2).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(4, 2).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(4, 2).last.created_at ? find_WH_reset_row(4, 2).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(4, 2).min == 0 && find_WH_reset_row(4, 2).max == 0"
                  @click="whResetCatalogueFunction(4, 2, 'AM', 'B')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(4, 2, 'AM', 'B')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


      </tr>
      <tr>
        <th>C</th>
        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(1, 3).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(1, 3).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(1, 3).last.created_at ? find_WH_reset_row(1, 3).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(1, 3).min == 0 && find_WH_reset_row(1, 3).max == 0"
                  @click="whResetCatalogueFunction(1, 3, 'RTG', 'C')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(1, 3, 'RTG', 'C')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(2, 3).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(2, 3).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(2, 3).last.created_at ? find_WH_reset_row(2, 3).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(2, 3).min == 0 && find_WH_reset_row(2, 3).max == 0"
                  @click="whResetCatalogueFunction(2, 3, 'STS', 'C')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(2, 3, 'STS', 'C')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(3, 3).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(3, 3).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(3, 3).last.created_at ? find_WH_reset_row(3, 3).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(3, 3).min == 0 && find_WH_reset_row(3, 3).max == 0"
                  @click="whResetCatalogueFunction(3, 3, 'RS', 'C')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(3, 3, 'RS', 'C')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(4, 3).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(4, 3).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(4, 3).last.created_at ? find_WH_reset_row(4, 3).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(4, 3).min == 0 && find_WH_reset_row(4, 3).max == 0"
                  @click="whResetCatalogueFunction(4, 3, 'AM', 'C')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(4, 3, 'AM', 'C')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


      </tr>
      <tr>
        <th>D</th>
        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(1, 4).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(1, 4).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(1, 4).last.created_at ? find_WH_reset_row(1, 4).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(1, 4).min == 0 && find_WH_reset_row(1, 4).max == 0"
                  @click="whResetCatalogueFunction(1, 4, 'RTG', 'D')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(1, 4, 'RTG', 'D')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(2, 4).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(2, 4).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(2, 4).last.created_at ? find_WH_reset_row(2, 4).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(2, 4).min == 0 && find_WH_reset_row(2, 4).max == 0"
                  @click="whResetCatalogueFunction(2, 4, 'STS', 'D')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(2, 4, 'STS', 'D')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(3, 4).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(3, 4).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(3, 4).last.created_at ? find_WH_reset_row(3, 4).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(3, 4).min == 0 && find_WH_reset_row(3, 4).max == 0"
                  @click="whResetCatalogueFunction(3, 4, 'RS', 'D')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(3, 4, 'RS', 'D')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>


        <td class="shiftWHselect" >
          <div style="margin-bottom: 3px;">
            <span
              style="padding:0 10px; border-right:1px solid #ffffff52; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #e74545;">mdi-arrow-down-bold</v-icon>: {{
                  find_WH_reset_row(4, 4).min }}(H)</span>
            <span style="padding:0 10px; display: inline-block;width: 90px;"><v-icon
                style="margin-top: -5px;font-size: 24px;color: #00b000;">mdi-arrow-up-bold</v-icon>: {{
                  find_WH_reset_row(4, 4).max }}(H)</span>
          </div>
          <span style="padding:0 10px; padding-top: 3px;"><v-icon
              style="margin-top: -5px;font-size: 24px;color: rgb(57 61 255);">mdi-timer-refresh</v-icon>: {{
                find_WH_reset_row(4, 4).last.created_at ? find_WH_reset_row(4, 4).last.created_at : 'empty'
              }}</span>
              <span class="show_wh_details_reset">
                <v-btn :disabled="find_WH_reset_row(4, 4).min == 0 && find_WH_reset_row(4, 4).max == 0"
                  @click="whResetCatalogueFunction(4, 4, 'AM', 'D')" color="rgb(23 61 117)" class="text-white"
                  prepend-icon="mdi-reload" size="small">RESET
                </v-btn>
              </span>
              <span class="show_wh_details">
                <v-btn @click="whReset_showDetails(4, 4, 'AM', 'D')" color="#00000073" class="text-white"
                  append-icon="mdi-clipboard-text-clock" size="small">DETAILS
                </v-btn>
              </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
          </v-card-text>
          <template v-slot:actions>

            <v-spacer></v-spacer>

            <v-btn style=" background-color: #808080c2; color: white !important;" @click="resetWHShow = false"> CLOSE
            </v-btn>

          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="showResetWHConfirm" max-width="500" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-clipboard-clock-outline"
          title="RESET THE WORKING HOURS">
          <v-card-text>
            Are you sure you want to reset the shift <span
              style=" font-size: 20px; font-weight: 700; color: #135e99; ">{{ shift_name }}</span> for <span
              style=" font-size: 20px; font-weight: 700; color: #135e99; ">{{ profileGroup_name }}</span>'s group
            wourking
            hours?
          </v-card-text>
          <template v-slot:actions>
            <v-btn style="display: none; background-color: rgb(61 137 51 / 76%); color: white !important;"
              @click="showResetWHConfirm = false"> Drivers list
            </v-btn>
            <v-btn style="display: none; background-color:rgb(134 59 181); color: white !important;"
              @click="showResetWHConfirm">
              WH History
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn style=" background-color: #808080c2; color: white !important;" @click="showResetWHConfirm = false">
              No
            </v-btn>
            <v-btn style=" background-color: rgb(74 63 244); color: white !important;" @click="resetOneTeamManually">
              RESET
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="showResetshowDetails_dialog" max-width="800" persistent>
        <v-card  class="confirmDialogInterface" prepend-icon="mdi-clipboard-text-clock" title="WORKING HOURS ACTIONS HISTORY :">
          <v-card-text>
            <v-card>
              <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
                <v-tab :value="1" prepend-icon="mdi-card-account-details">DRIVERS WH</v-tab>
                <v-tab :value="2" prepend-icon="mdi-calculator-variant">COUNT ACTIONS</v-tab>
                <v-tab :value="3" prepend-icon="mdi-clipboard-text-clock">RESET ACTIONS</v-tab>
              </v-tabs>

              <v-tabs-window v-model="tab">
                <v-tabs-window-item :value="1">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-table style=" max-height:577px; min-height: 577px;"  class="wh_details_tables">
                          <thead>
                            <tr>
                              <th class="text-center ">
                                MATRICULE
                              </th>
                              <th class="text-center ">
                                FULL NAME
                              </th>
                              <th class="text-center">
                                WH
                              </th>
                            </tr>
                          </thead>
                          <tbody >
                            <tr
                            v-for="item in get_users_wh_details_sh_gp"
                            :key="item.id"
                            >
                              <td class="text-center">{{ item.matricule }}</td>
                              <td class="text-center">{{ item.firstname+' '+item.lastname }}</td>
                              <td class="text-center">{{ item.workingHours }}</td>

                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-tabs-window-item>
                <v-tabs-window-item :value="2">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-table  style=" max-height: 577px; min-height: 577px;" class="wh_details_tables">
                          <thead>
                            <tr>
                              <th class="text-center">
                                PLANNING DATE
                              </th>
                              <th class="text-center">
                                TYPE
                              </th>
                              <th class="text-center">
                                BY
                              </th>
                              <th class="text-center">
                                AT
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                            v-for="item in get_count_wwh_details_sh_gp"
                            :key="item.id"
                            >
                            <td class="text-center">{{ item.planning?.toUpperCase() }}</td>
                            <td class="text-center">{{ item.type }}</td>
                            <td class="text-center">{{ item.user?item.user.matricule:'SYSTEM' }}</td>
                            <td class="text-center">{{ item.created_at }}</td>

                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-tabs-window-item>
                <v-tabs-window-item :value="3">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-table  style=" max-height: 577px; min-height: 577px;" class="wh_details_tables">
                          <thead>
                            <tr>
                              <th class="text-center">
                                DATE
                              </th>
                              <th class="text-center">
                                BY
                              </th>
                              <th class="text-center">
                                MIN
                              </th>
                              <th class="text-center">
                                MAX
                              </th>
                              <th class="text-center">
                                REMOVED
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                            v-for="item in get_wwh_details_sh_gp"
                            :key="item.id"
                            >
                            <td class="text-center">{{ item.created_at }}</td>
                              <td class="text-center">{{ item.user?item.user.matricule:'system' }}</td>
                              <td class="text-center">{{ item.min.toFixed(2) }}</td>
                              <td class="text-center">{{ item.max.toFixed(2) }}</td>
                              <td class="text-center">{{ item.tobeMinced.toFixed(2) }}</td>

                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-card-text>
          <template v-slot:actions>

            <v-spacer></v-spacer>
            <v-btn style=" background-color: #808080c2; color: white !important;"
              @click="showResetshowDetails_dialog = false">
              CLOSE
            </v-btn>

          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout !== null ? timeout : undefined">
        <span v-html="text">

        </span>

        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>

      </v-snackbar>
    </div>
  </template>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as XLSX from 'xlsx';
export default {
  data: () => ({
    count_wh_history_data:[],
    wh_history_data:[],
    driver_wh_details_selected_list:[],
    tab: null,
    addUserInterface_dialog: false,
    imageUrl: null,
    image: null,
    image_2: null,
    notificationClassSuccess: "",
    notificationClassFailed: "",
    notificationClassSuccessMsg: "",
    notificationClassFailedMsg: "",
    showDeleteUserConfirm: false,
    showResetUserConfirm: false,
    showEdidUserConfirm: false,
    isEdit: false,
    tab: null,
    activeRole: 0,  // Tracks the active tab for roles
    activeTab: null,   // Tracks the active tab inside expanded rows
    activeTab_2: null,   // Tracks the active tab inside expanded rows
    expanded: [],   // Tracks expanded rows
    search: '',
    shift_name: '',
    shift_name_id: null,
    profileGroup_name: '',
    profileGroup_name_id: null,
    showResetWHConfirm: false,
    showResetshowDetails_dialog: false,
    whResetCatalogue: [],
    resetWHShow: false,
    dialog: false,
    dialogDelete: false,
    dialogReset: false,
    editedItem: null,
    dialogType: '',
    snackbar: false,
    text: '',
    notAddedUsers: [],
    timeout: 2500,
    selectedValue: "",
    roles: [],
    shifts: [],
    profileGroups: [],
    file: {
      name: '',
    },
    reader: null,
    fileRead: false,
    user: {
      id: -1,
      matricule: "",
      firstname: "",
      lastname: "",
      email: "",
      workingHours: 0,
      wh_global: 0,
      sby_workingHours: 0,
      role_id: "",
      roleName: "",
      shift_id: "",
      shiftName: "",
      profile_group_id: "",
      profile_groupName: "",
      isactive: 1,
      profile_picture: null
    },
    user_to_add: {
      id: -1,
      matricule: "",
      firstname: "",
      lastname: "",
      email: "",
      workingHours: 0,
      wh_global: 0,
      sby_workingHours: 0,
      profile_group_id: "",
      profile_groupName: "",
      isactive: 1,
      profile_picture: null,
      newImg: null,
      edited: false,
      department: null,
      department_id: null,
      shift: null,
      shift_id: "",
      shiftName: "",
      role: null,
      role_id: "",
      roleName: "",
    },
    headers: [
      { title: 'PROFILE', value: 'actions', sortable: false },
      { title: 'MATRICULE', value: 'matricule', sortable: true },
      { title: 'FULL NAME', value: 'fullname', align: 'start', sortable: true },
      { title: 'EMAIL', value: 'email', sortable: true },
      { title: 'STATUS', value: 'isactive', sortable: true },
    ],
    headers_driver: [
      { title: 'PROFILE', value: 'actions', sortable: false },
      { title: 'MATRICULE', value: 'matricule', sortable: true },
      { title: 'FULL NAME', value: 'fullname', align: 'start', sortable: true },
      { title: 'SHIFT', value: 'shiftName', sortable: true },
      { title: 'PROFIL', value: 'profile_groupName', sortable: true },
      { title: 'WORKING HOURS', value: 'workingHours', sortable: true },
      { title: 'GLOBAL WORKING HOURS', value: 'wh_global', sortable: true },
      { title: 'STATUS', value: 'isactive', sortable: true },
    ],
    users: [],
    searchQuery: '',
    filteredUsers: [],
    submitClicked: false,
  }),
  computed: {
    ...mapGetters([
      "getUsers",
      "getToken",
      "getRoles",
      "getShifts",
      "getProfileGroups",
      "get_wh_all",
      "getDepartments",
      "get_wwh_details_sh_gp",
      "get_count_wwh_details_sh_gp",
      "get_users_wh_details_sh_gp",
      "getUserActive",
    ]),
    uniqueRoles() {
      // Extract unique roles from the users list
      return [...new Set(this.filteredUsers.map(user => user.role?.name))];
    }

  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    dialogReset(val) {
      val || this.closeReset()
    },
    selectedValue(newValue) {
    }
  },
  created() {
    this.setDepartmentsAction();
  },
  mounted() {
    this.refreshUsersTable();
  },
  methods: {
    ...mapActions([
      "setUsersAction",
      "setLoadingValueAction",
      "resetPasswordAction",
      "deleteUserAction",
      "registerUserAction",
      "editUserAction",
      "setRolesAction",
      "setShiftsAction",
      "setProfileGroupsAction",
      "wh_index_action",
      "wh_reset_action",
      "setDepartmentsAction",
      "showNotificationClassSuccess",
      "addUserAction",
      "WhHistory_details_index_action",
    ]),
    addUserMethod_new() {
      this.setLoadingValueAction(true);
      this.user_to_add.sby_workingHours = (this.user_to_add.sby_workingHours) ? this.user_to_add.sby_workingHours : 0;
      this.user_to_add.checker_workingHours = (this.user_to_add.checker_workingHours) ? this.user_to_add.checker_workingHours : 0;
      this.user_to_add.deckman_workingHours = (this.user_to_add.deckman_workingHours) ? this.user_to_add.deckman_workingHours : 0;
      this.user_to_add.assistant_workingHours = (this.user_to_add.assistant_workingHours) ? this.user_to_add.assistant_workingHours : 0;
      this.user_to_add.workingHours = (this.user_to_add.workingHours == undefined || !this.user_to_add.workingHours == undefined) ? 0 : this.user_to_add.workingHours;
      this.user_to_add.wh_global = (this.user_to_add.wh_global) ? this.user_to_add.wh_global : 0;
      this.user_to_add.roleName = (this.user_to_add.role) ? this.user_to_add.role.name : 0;

      this.user_to_add.isactive = (this.user_to_add.isactive) ? 1 : 0;
      const formData = new FormData();
      if (this.image_2) {
        formData.append('profile_picture', this.image_2);
      }
      Object.keys(this.user_to_add).forEach(key => {
        formData.append(key, this.user_to_add[key]);
      });
      this.addUserAction(formData).then((e) => {
        this.user_to_add.edited = false;
        this.user_to_add.profile_groupName = (e.profile_group_id) ? e.profile_group?.type : "";
        this.user_to_add.shiftName = (e.shift_id) ? e.shift?.category : "";
        this.user_to_add.roleName = (e.role_id) ? e.role?.name : "";
        this.user_to_add.shift = e.shift ? e.shift : null;
        this.user_to_add.profile_group = e.profile_group ? e.profile_group : null;
        this.user_to_add.department = e.department;
        this.user_to_add.role = e.role;
        this.filteredUsers.push(this.user_to_add)
        this.users.push(this.user_to_add)
        this.addUserInterface_dialog = false;
        this.showNotificationClassSuccess("Profile added successfully !");
        this.setLoadingValueAction(false);

      }).catch((e) => {
        this.addUserInterface_dialog = false;
        this.showNotificationClassFailed("Profile added failed !");
        this.setLoadingValueAction(false);
      })
    },
    openAddUserDialog() {
      this.addUserInterface_dialog = true;
      this.user_to_add = {
        id: -1,
        matricule: "",
        firstname: "",
        lastname: "",
        email: "",
        workingHours: 0,
        wh_global: 0,
        sby_workingHours: 0,
        role_id: "",
        roleName: "",
        shift_id: "",
        shiftName: "",
        profile_group_id: "",
        profile_groupName: "",
        isactive: 1,
        profile_picture: null
      };
    },
    deleteNew() {
      this.setLoadingValueAction(true)
      this.deleteUserAction(this.user.id).then((response) => {
        this.filteredUsers = this.filteredUsers.filter((e) => {
          return e.id != this.user.id;
        });
        this.users = this.users.filter((e) => {
          return e.id != this.user.id;
        });
        this.showNotificationClassSuccess('Delete successfully!');
        this.setLoadingValueAction(false);
        this.showDeleteUserConfirm = false;
      }).catch(error => {
        this.showNotificationClassFailed('Delete failed!');
        this.setLoadingValueAction(false)
        this.showDeleteUserConfirm = false;
      });
    },
    resetPasswordNew() {
      this.setLoadingValueAction(true)
      this.resetPasswordAction(this.user.id).then((response) => {
        this.showNotificationClassSuccess('Reset password successfully!');
        this.setLoadingValueAction(false);
        this.showResetUserConfirm = false;
      }).catch(error => {
        this.showNotificationClassFailed('Reset password failed!');
        this.setLoadingValueAction(false);
        this.showResetUserConfirm = false;

      });
    },
    onFileChange(e, item) {
      const selectedFile = e.target.files[0];
      this.image = selectedFile;
      if (selectedFile) {
        // Create a URL for the selected file
        item.newImg = URL.createObjectURL(selectedFile);
      }
    },
    onFileChange_2(e, item) {
      const selectedFile = e.target.files[0];
      this.image_2 = selectedFile;
      if (selectedFile) {
        // Create a URL for the selected file
        item.newImg = URL.createObjectURL(selectedFile);
      }
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
    showEdidUserConfirmMethode() {
      this.setLoadingValueAction(true);
      this.user.sby_workingHours = (this.user.sby_workingHours) ? this.user.sby_workingHours : 0;
      this.user.checker_workingHours = (this.user.checker_workingHours) ? this.user.checker_workingHours : 0;
      this.user.deckman_workingHours = (this.user.deckman_workingHours) ? this.user.deckman_workingHours : 0;
      this.user.assistant_workingHours = (this.user.assistant_workingHours) ? this.user.assistant_workingHours : 0;
      this.user.workingHours = (this.user.workingHours == undefined || !this.user.workingHours == undefined) ? 0 : this.user.workingHours;
      this.user.wh_global = (this.user.wh_global) ? this.user.wh_global : 0;
      this.user.roleName = (this.user.role) ? this.user.role.name : 0;

      this.user.isactive = (this.user.isactive) ? 1 : 0;
      const formData = new FormData();
      if (this.image) {
        formData.append('profile_picture', this.image);
      }
      Object.keys(this.user).forEach(key => {
        formData.append(key, this.user[key]);
      });
      this.editUserAction(formData).then((e) => {
        this.filteredUsers = this.filteredUsers.map((e1) => {
          if (e1.id == this.user.id) {
            this.user.edited = false;
            this.user.profile_groupName = (e.profile_group_id) ? e.profile_group?.type : "";
            this.user.shiftName = (e.shift_id) ? e.shift?.category : "";
            this.user.roleName = (e.role_id) ? e.role?.name : "";
            this.user.shift = e.shift ? e.shift : null;
            this.user.profile_group = e.profile_group ? e.profile_group : null;
            this.user.department = e.department;
            this.user.role = e.role;
            return this.user;
          }
          else
            return e1;
        });
        this.users = this.filteredUsers.map((e) => {
          if (e.id == this.user.id) {
            e.edited = false;
            return e;
          }
          else
            return this.user;
        });
        this.showEdidUserConfirm = false;
        this.showNotificationClassSuccess("Profile edited successfully !");
        this.setLoadingValueAction(false);

      }).catch((e) => {
        this.showNotificationClassFailed("Profile edited failed !");
        this.setLoadingValueAction(false);
      })
    },
    toUpperCase(attribute) {
      return (item) => item[attribute]?.toUpperCase(); // Converts the text to uppercase
    },
    toggleEditMode() {
      this.isEdit = !this.isEdit;
    },
    resetOneTeamManually(equipment_type, shift) {
      this.wh_reset_action({
        "shift_id": this.shift_name_id,
        "profile_group_id": this.profileGroup_name_id,
        "user_id":this.getUserActive.id,
        "min":this.find_WH_reset_row( this.profileGroup_name_id,this.shift_name_id)?.min,
        "max":this.find_WH_reset_row( this.profileGroup_name_id,this.shift_name_id)?.max
      })
        .then((e) => {
          this.showResetWHConfirm = false;
        })
    },
    find_WH_reset_row(equipment_type, shift) {
      let rst = this.get_wh_all.filter((e) => {
        return e.equipment_type == equipment_type && e.shift == shift;
      });
      if (rst.length > 0) {
        return rst[0];
      }
      else {
        return {
          "min": 'empty',
          "max": 'empty',
          "last": 'empty',
          "equipment_type": 'empty',
          "shift": 'empty'
        };
      }
    },
    resetWHShowfunction() {
      this.wh_index_action()
        .then((e) => {
          this.resetWHShow = true;
        })
    },
    whResetCatalogueFunction(profileGroup_, shift_, profileGroup_name, shift_name) {
      this.profileGroup_name_id = profileGroup_;
      this.shift_name_id = shift_;
      this.profileGroup_name = profileGroup_name;
      this.shift_name = shift_name;
      this.showResetWHConfirm = true;

    },
    whReset_showDetails(profileGroup_, shift_, profileGroup_name, shift_name) {
      this.profileGroup_name_id = profileGroup_;
      this.shift_name_id = shift_;
      this.profileGroup_name = profileGroup_name;
      this.shift_name = shift_name;

      console.log("profileGroup_",profileGroup_)
      console.log("shift_",shift_)
      this.driver_wh_details_selected_list=this.getUsers.filter((e)=>{
       return e.shift_id == shift_ && e.profile_group_id == profileGroup_
      });
      this.WhHistory_details_index_action({
        profile_group_id:profileGroup_,
        shift_id:shift_
      }).then(()=>{
        this.showResetshowDetails_dialog = true;
      })
    },
    requiredRule(field, fieldName) {
      return field || field === 0 ? true : `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} field is required`;
    },
    refreshUsersTable(val) {
      this.setLoadingValueAction(true)
      this.setUsersAction()
        .then((response) => {
          this.users = this.getUsers;
          this.filteredUsers = this.users.map(item => ({
            fullname: item.firstname + " " + item.lastname?.toUpperCase(),
            matricule: item.matricule,
            email: item.email,
            workingHours: item.workingHours || item.workingHours === 0 ? item.workingHours : 'undefined',
            wh_global: item.wh_global || item.wh_global === 0 ? item.wh_global : 'undefined',
            sby_workingHours: item.sby_workingHours || item.sby_workingHours === 0 ? item.sby_workingHours : 'undefined',
            role: item.role,
            roleName: item.role?.name,
            profile_groupName: item.profile_group ? item.profile_group.type : 'none',
            shiftName: item.shift ? item.shift.category : 'none',
            firstname: item.firstname,
            lastname: item.lastname,
            isactive: item.isactive,
            id: item.id,
            role_id: item.role_id,
            shift_id: item.shift_id,
            profile_group_id: item.profile_group_id,
            edited: false,
            department: item.department,
            department_id: item.department?.id,
            profile_group: item.profile_group,
            shift: item.shift,
            expanded: false,
            oldMat: item.matricule,
            profile_picture: item.profile_picture,
            newImg: null,

          }))

          if (val) {
            this.text = val.text
            if (this.notAddedUsers.length > 0) {
              this.timeout = null
              this.snackbar = true
              this.notAddedUsers = []
            }
            else {
              this.timeout = 1500
              this.snackbar = true
            }

          }
        })
        .catch(error => {
          this.setLoadingValueAction(false)
        });
      this.setRolesAction().then(() => {
        this.roles = this.getRoles.map((role) => ({
          name: role.name,
          id: role.id
        }));
      });

      this.setShiftsAction().then(() => {
        this.setLoadingValueAction(false)
        this.shifts = this.getShifts.map((shift) => ({
          category: shift.category,
          id: shift.id
        })).sort((a, b) => a.category.localeCompare(b.category));
      });

      this.setProfileGroupsAction().then(() => {
        this.profileGroups = this.getProfileGroups.map((profileGroup) => ({
          type: profileGroup.type,
          id: profileGroup.id
        }))
      })

    },
    editItem(item) {
      this.editedItem = { ...item };
      this.editedIndex = item.id;
      this.dialogType = 'edit';
      this.dialog = true;
      // Populate other user details
      this.user.id = this.editedIndex;
      this.user.matricule = this.editedItem.matricule;
      this.user.firstname = this.editedItem.firstname;
      this.user.lastname = this.editedItem.lastname;
      this.user.email = this.editedItem.email;
      this.user.role_id = this.editedItem.role_id;
      this.user.shift_id = this.editedItem.shift_id;
      this.user.profile_group_id = this.editedItem.profile_group_id;
      this.user.isactive = String(this.editedItem.isactive);
    },
    resetItem(item) {
      const edited = item.edited;
      const expanded = item.expanded;
      item = JSON.parse(JSON.stringify(this.getUsers.filter((e) => e.id == item.id)[0]));
      this.filteredUsers = this.filteredUsers.map((e) => {
        if (e.id == item.id) {
          item.newImg = null;
          item.edited = !edited;
          item.expanded = expanded;
          item.role_id = e.role.id;
          item.shift_id = e.shift?.id;
          item.profile_group_id = e.profile_group?.id;
          item.department_id = e.department?.id;
          return item;
        }
        return e;
      });

      return item;
    },
    openShowEdidUserConfirm(item) {
      this.user = item;
      this.showEdidUserConfirm = true;

    },
    openShowDeleteUserConfirm(item) {
      this.user = item;
      this.showDeleteUserConfirm = true;

    },
    openShowResetUserConfirm(item) {
      this.user = item;
      this.showResetUserConfirm = true;

    },
    deleteItem(item) {
      this.editedItem = { ...item };
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.setLoadingValueAction(true)
      this.deleteUserAction(this.editedIndex).then((response) => {
        this.setLoadingValueAction(false)
        this.refreshUsersTable({ text: "user deleted successfully" })
      }).catch(error => {
        this.setLoadingValueAction(false)
        this.text = "error deleting user"
        this.snackbar = true
      });
      this.closeDelete()
    },
    resetPasswordConfirm() {
      this.setLoadingValueAction(true)
      this.resetPasswordAction(this.editedIndex).then((response) => {
        this.setLoadingValueAction(false)
        this.refreshUsersTable({ text: "user password reset successfully" })
      }).catch(error => {
        this.setLoadingValueAction(false)
        this.text = "error reseting user password"
        this.snackbar = true
      });
      this.closeReset()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.dialogType = ''
      this.user={
      id: -1,
      matricule: "",
      firstname: "",
      lastname: "",
      email: "",
      workingHours: 0,
      wh_global: 0,
      sby_workingHours: 0,
      role_id: "",
      roleName: "",
      shift_id: "",
      shiftName: "",
      profile_group_id: "",
      profile_groupName: "",
      isactive: 1,
      profile_picture: null
    };

    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeReset() {
      this.dialogReset = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      this.submitClicked = true
      if (!this.user) {
        console.log("User Not Defined")
      }
      const userToSend = { ...this.user };
      delete userToSend.id;
      delete userToSend.profile_groupName;
      delete userToSend.shiftName;
      delete userToSend.roleName;

      console.log(userToSend);
      if (!userToSend) {
        console.log("Invalid user", userToSend)
        return;
      }
      else {
        if (this.dialogType == "edit") {
          this.setLoadingValueAction(true)
          this.editUserAction(this.user)
            .then((response) => {
              this.setLoadingValueAction(false)
              if (response)
                this.refreshUsersTable({ text: "user edited successfully" })
              else {
                this.text = "error editing user"
                this.snackbar = true
              }
            }).catch(error => {
              console.error("Edit user error:", error);
              this.setLoadingValueAction(false)
              this.text = "error editing user"
              this.snackbar = true
            });
          this.close()
        }
        else {
          delete userToSend.isactive;
          this.setLoadingValueAction(true)
          this.registerUserAction(userToSend).then((response) => {
            this.setLoadingValueAction(false)
            if (response)
              this.refreshUsersTable({ text: "user added successfully" })
            else {
              this.text = "error adding user"
              this.snackbar = true
            }
          }).catch(error => {
            console.error("Register user error:", error);
            this.setLoadingValueAction(false)
            this.text = "error adding user"
            this.snackbar = true
          });
          // console.log(userToSend)
          this.close()
        }

      }
    },
    openFileDialog() {
      this.$refs.fileInput.click();
    },
    resetWH() {
      if (this.users.length > 0) {
        let usersSorted = this.users.sort((a, b) => {
          return a.workingHours - b.workingHours;
        });
        console.log(usersSorted[0]);
        if (usersSorted[0].workingHours < 0) {
          usersSorted[0].workingHours = 0;
        }
      }
    },
    importUsers(reader, file) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result); // Convert file data to Uint8Array
        const workbook = XLSX.read(data, { type: 'array' }); // Read the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the name of the first sheet
        const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert worksheet to JSON

        this.setLoadingValueAction(true);
        const promises = [];
        const usersList = [];
        for (const rowData of jsonData.slice(1)) { // Start from index 1 to skip header row
          const [matricule, firstname, lastname, email, roleName, profileGroupName, shiftCategory, workingHours, sby_workingHours, wh_global] = rowData;
          console.log(roleName + " " + profileGroupName + " " + shiftCategory);
          const role = this.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
          const profileGroup = this.profileGroups.find(profileGroup => profileGroup.type.toLowerCase() === profileGroupName?.toLowerCase());
          const shift = this.shifts.find(shift => shift.category.toLowerCase() === shiftCategory?.toLowerCase());
          if (role && matricule) {
            const user = {
              matricule: String(matricule).padStart(4, "0"),
              firstname: firstname?.toLowerCase(),
              lastname: lastname?.toLowerCase(),
              email: email?.toLowerCase(),
              role_id: role.id,
              profile_group_id: profileGroup?.id,
              shift_id: shift?.id,
              workingHours,
              sby_workingHours,
              wh_global
            };
            usersList.push(user);
            ///const promise = this.registerUserAction(user)
            ///  .then(response => {
            ///    if (!response) {
            ///      this.notAddedUsers.push(user.matricule);
            ///    }
            ///  })
            ///  .catch(error => {
            ///    console.log("Error adding user:", error);
            ///    this.notAddedUsers.push(user.matricule);
            ///  });
            ///
            //promises.push(promise);
          } else {
            console.warn("Role oe matricule are not found for row:", rowData);
          }
        }
        console.log(usersList);
        this.setLoadingValueAction(false);
        this.refreshUsersTable({ text: "Importing users done" + '<br>' + "Error adding users: " + (this.notAddedUsers.length > 0 ? this.notAddedUsers.join(", ") : "none") });
        this.reader = null;
        this.file = { name: "" };
        //Promise.all(promises)
        //  .then(() => {
        //    this.setLoadingValueAction(false);
        //    this.refreshUsersTable({ text: "Importing users done" + '<br>' + "Error adding users: " + (this.notAddedUsers.length > 0 ? this.notAddedUsers.join(", ") : "none") });
        //    this.reader = null;
        //    this.file = { name: "" };
        //  });
      };
      reader.readAsArrayBuffer(file);
    },
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Get the selected file
      this.reader = new FileReader();
      this.importUsers(this.reader, this.file);
      event.target.value = null; // Reset the file input
    },
    filteredUsersByRole(role) {
      if (role == 0) {
        return this.filteredUsers;
      }
      return this.filteredUsers.filter(user => user?.role?.name === role);
    },
    filteredUsersByMatricule(matricule) {
      this.filteredUsers = this.filteredUsers.map(user => {
        if (user.matricule === matricule) {
          user.edited = !user.edited;
        }
        return user;
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.expanded-row-card {
  padding: 16px;
  margin-top: 8px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.action-buttons-row {
  margin-top: 16px;
}

.v-chip {
  margin-right: 5px;
}

.v-avatar {
  margin-bottom: 8px;
}

.container {
  display: grid;
  grid-template-rows: 10vh 10vh 70vh;
}



.addUserButtonZone {
  background-color: white;
  height: 30px;
  margin-bottom: 2rem;
}

.addUserButton {
  border: 1px solid gray;
  background-color: darkblue;
}

.addUserButtonStyle {
  width: fit-content;
  display: flex;
  justify-content: end;
  align-items: center;
}

.parentContainer {
  width: 100%;
  scroll-behavior: none;
}

.searchContainer {
  margin: auto;
  width: 60vw;
}

.dialogText {
  font-size: medium;
  background-color: white;
  text-align: center;
}

.dialogCancel {
  background-color: red;
  color: white;
}

.dialogCancel:hover {
  background-color: darkred;
}

.dialogOk {
  background-color: blue;
  color: white;
}

.dialogOk:hover {
  background-color: darkblue;
}

.dialogAddUserTitleContainer {
  display: flex;
  width: 100%;
  justify-content: start;
  margin-left: 15px;
  padding-top: 15px;
}

.actions {
  display: flex;
  justify-content: start;
  align-items: center;
}

.icon {
  margin: 6px;
}

.inactive-user {
  color: lightsalmon;
}

.dialog {
  z-index: 20;
}

.dialogTop {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.importfile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
}

.importfile p {
  font-size: small;
}

.addActions {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 5%;
  gap: 2%;
}

.importUsersButton {
  border: 1px solid white;
  background-color: rgb(190 100 100) !important;
  color: white !important;
}

.resetWHShowfunction {
  border: 1px solid white;
  background-color: rgb(28 167 28) !important;
  color: white !important;
}

.addUserButton {
  border: 1px solid white;
  background-color: rgb(43 59 201) !important;
  color: white !important;
}

.avatarChoosePic {
  display: none;
  position: absolute;
  bottom: 0;
  background-color: #0000006b;
  height: 100%;
  width: 100%;
  cursor: pointer;
  user-select: none;
}

.avatarChoosePic:active {
  opacity: 0.7;
}

.addAvatarPic:hover {
  .avatarChoosePic {
    display: block;

  }
}

.addAvatarPic {
  border: 3px solid rgb(226 234 248);
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
