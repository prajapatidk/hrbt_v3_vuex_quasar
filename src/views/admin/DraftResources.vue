<template>
  <div class="q-pa-lg">
    <q-table
      title="Treats"
      :filter="filter"
      :rows="GET_RESOURCES"
      :columns="columns"
      row-key="name"
      table-header-class=""
      flat
      bordered
      :rows-per-page-options="[14]"
      class="shadow-1 no-border"
    >
      <template v-slot:top>
        <div class="q-pa-sm row full-width">
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
            outlined
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            @click="openBookingModal(props.row.id)"
            label="Book Now"
            size="md"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-bookedBy="props">
        <q-td :props="props">
          {{ props.row.bookingname }} <br />
          {{ props.row.bookingemailId }}
        </q-td>
      </template>
      <template v-slot:body-cell-period="props">
        <q-td :props="props">
          {{ props.row.dateIn }} - {{ props.row.dateOut }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="positive"
            @click="openResourceDetailsModal(props.row.id)"
            icon-right="visibility"
            size="sm"
          />
          <q-btn
            color="primary"
            @click="edititem(props.row.id)"
            icon-right="edit"
            class="q-mx-sm"
            size="sm"
          />
          <q-btn
            color="negative"
            @click="deleteItem(props.row.id)"
            icon-right="delete"
            size="sm"
          />
        </q-td>
      </template>
    </q-table>
  </div>

  <q-dialog v-model="openCommonDialog" :persistent="true">
    <q-card class="q-pa-md" style="width: 670px; max-width: 80vw">
      <q-card-section class="row q-pa-none q-pb-md">
        <div class="text-h6" v-if="bookingModalElement">
          Select the booking date
        </div>
        <div class="text-h6" v-if="resourceModalElement">Resource details</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeCommonModal"
          v-close-popup
        />
      </q-card-section>
      <div class="row" v-if="bookingModalElement">
        <div class="col-6">
          <q-date v-model="days" :options="optionsFn" multiple />
        </div>
        <div class="col-6">
          <div class="q-mb-md">
            <q-select
              outlined
              v-model="selectedTeam"
              :options="teams"
              label="Select Team"
            />
          </div>
          <div class="q-mb-md">
            <q-input outlined placeholder="Description" type="textarea" />
          </div>

          <div class="row reverse">
            <q-btn
              label="Book Now"
              type="submit"
              class="q-ml-sm"
              color="secondary"
            />
          </div>
        </div>
      </div>
      <div class="row" v-if="resourceModalElement">
        <table class="modal_table">
          <tr>
            <td width="200">Name</td>
            <td>{{ resourceItemDetails.name }}</td>
          </tr>
          <tr>
            <td width="200">Type</td>
            <td>{{ resourceItemDetails.type }}</td>
          </tr>

          <tr>
            <td width="200">IP Address</td>
            <td>{{ resourceItemDetails.ipAddress }}</td>
          </tr>

          <tr>
            <td width="200">Console</td>
            <td>{{ resourceItemDetails.console }}</td>
          </tr>
          <tr>
            <td width="200">MGMT Port</td>
            <td>{{ resourceItemDetails.mgmtport }}</td>
          </tr>
          <tr>
            <td width="200">Model</td>
            <td>{{ resourceItemDetails.model }}</td>
          </tr>
          <tr>
            <td width="200">ACA</td>
            <td>{{ resourceItemDetails.aca }}</td>
          </tr>

          <tr>
            <td>Team</td>
            <td>{{ resourceItemDetails.team }}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>
              {{ resourceItemDetails.description }}
            </td>
          </tr>
        </table>
      </div>
      <div class="row reverse">
        <q-btn
          label="Close"
          type="submit"
          v-close-popup
          @click="closeCommonModal"
          color="primary"
        />
      </div>
    </q-card>
  </q-dialog>
</template>


<script>
import { exportFile, useQuasar } from "quasar";
import { defineComponent, watch } from "vue";
import { mapActions, mapGetters } from "vuex";
import resourcetableHeader from "@/utils/table/resourceHeader";
import { teams, resourceType } from "@/utils/constant";
import { validateEmail, notifyAlert } from "@/utils/helper";

export default defineComponent({
  name: "DraftResources",
  data() {
    return {
      isAddEditMode: false,
      openCommonDialog: false,
      days: [],
      selectedTeam: null,
      teams: teams,
      resourceType: resourceType,
      filter: "",
      bookingModalElement: false,
      resourceModalElement: false,
      name: "",
      type: "",
      ipAddress: "",
      console: "",
      mgmtport: "",
      model: "",
      aca: "",
      editId: null,
      resourceItemDetails: [],

      rules: {
        required: (v) => !!v || "This is a required field",
      },

      columns: [
        // {
        //   name: "serial",
        //   required: true,
        //   label: "#",
        //   field: "serial",
        //   align: "left",
        // },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "type",
          align: "left",
          label: "Type",
          field: "type",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "ipAddress",
          align: "center",
          label: "IP Address",
          field: "ipAddress",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "console",
          align: "center",
          label: "Console",
          field: "console",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "mgmtport",
          align: "center",
          label: "MGMT Pport",
          field: "mgmtport",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "model",
          align: "center",
          label: "Model",
          field: "model",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "aca",
          align: "center",
          label: "ACA",
          field: "aca",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "status",
          align: "center",
          label: "Status",
          field: "status",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "bookedBy",
          align: "left",
          label: "Booked by	",
          field: "bookedBy",
        },
        {
          name: "period",
          align: "center",
          label: "Period",
          field: "period",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "team",
          align: "center",
          label: "Team",
          field: "team",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "action",
          align: "center",
          label: "Action",
          field: "action",
        },
      ],

      optionsFn(date) {
        const currDate = new Date()
          .toISOString()
          .split("T")[0]
          .replaceAll("-", "/");
        return (
          date >= currDate &&
          date <= "2050/12/31" &&
          !["2023/06/25"].includes(date)
        );
      },
    };
  },
  async mounted() {
    await this.fetchAll();
  },
  computed: {
    ...mapGetters("resource", ["GET_RESOURCES", "GET_RESOURCE_DETAILS"]),
  },
  methods: {
    ...mapActions("resource", [
      "fetchAll",
      "createResource",
      "updateResource",
      "softDeleteResource",
    ]),

    openForm: function () {
      this.isAddEditMode = true;
    },

    closeForm: function () {
      this.isAddEditMode = false;
    },

    edititem: function (id) {
      this.isAddEditMode = true;
      this.editId = id;
      const getEditResource = this.GET_RESOURCES.find((item) => item.id == id);
      this.name = getEditResource.name;
      this.type = getEditResource.type;
      this.ipAddress = getEditResource.ipAddress;
      this.console = getEditResource.console;
      this.mgmtport = getEditResource.mgmtport;
      this.model = getEditResource.model;
      this.aca = getEditResource.aca;
    },

    onSubmit: async function () {
      const payload = {
        name: this.name,
        type: this.type,
        ipAddress: this.ipAddress,
        console: this.console,
        mgmtport: this.mgmtport,
        model: this.model,
        aca: this.aca,
      };

      try {
        if (this.editId) {
          const result = await this.updateResource({
            id: this.editId,
            payload: payload,
          });
          if (result.status == 200) {
            notifyAlert("positive", "Resource updated successfully");
          }
          this.editId = null;
          this.isAddEditMode = false;
          this.clearForm();
        } else {
          const result = await this.createResource(payload);
          if (result.status == 200) {
            notifyAlert("positive", "Resource created successfully");
          }
          this.clearForm();
        }
      } catch (e) {}
    },

    deleteItem: async function (id) {
      const result = await this.softDeleteResource(id);
      console.log(result);
      if (result.status == 200) {
        notifyAlert("positive", result.data);
      }
    },

    wrapCsvValue: function (val, formatFn, row) {
      let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

      formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted);

      formatted = formatted.split('"').join('""');

      return `"${formatted}"`;
    },
    exportTable: function () {
      const content = [this.columns.map((col) => this.wrapCsvValue(col.label))]
        .concat(
          this.rows.map((row) =>
            this.columns
              .map((col) =>
                this.wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        notifyAlert("negative", "Browser denied file download...");
      }
    },
    openBookingModal: function (id) {
      this.openCommonDialog = true;
      this.bookingModalElement = true;
    },
    openResourceDetailsModal: function (id) {
      this.openCommonDialog = true;
      this.resourceModalElement = true;
      this.resourceItemDetails = this.GET_RESOURCES.find(
        (item) => item.id == id
      );
    },
    closeCommonModal: function () {
      setTimeout(() => {
        this.bookingModalElement = false;
        this.resourceModalElement = false;
        this.resourceItemDetails = [];
      }, 800);
    },
    clearForm: function () {
      this.name = null;
      this.type = null;
      this.ipAddress = null;
      this.console = null;
      this.mgmtport = null;
      this.model = null;
      this.aca = null;
    },
  },
  watch: {
    // openCommonDialog() {
    //   this.bookingForm = true;
    // },
  },
});
</script>
<style lang="sass" scoped>
::v-deep(.q-table th)
  font-size: 15px !important
  background: #f7f6f6

::v-deep(.q-table td)
  font-size: 14px !important

table.modal_table
  width: 100%
  border-collapse: collapse
  margin-bottom: 20px

  td
    border: 1px solid gainsboro
    padding: 7px 14px
</style>