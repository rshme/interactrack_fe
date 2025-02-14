<template>
    <div id="data-list-list-view" class="data-list-container">
        <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" />

        <vs-table ref="table" multiple v-model="selected" pagination :max-items="itemsPerPage" search :data="invoices">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click="addNewData">
                        <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                        <span class="ml-2 text-base text-primary">Add New</span>
                    </div>
                </div>

                <!-- ITEMS PER PAGE -->
                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                    <div
                        class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                        <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                            {{
                            invoices.length - currentPage * itemsPerPage > 0
                            ? currentPage * itemsPerPage
                            : invoices.length
                            }}
                            of {{ queriedItems }}</span>
                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                    </div>
                    <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
                    <vs-dropdown-menu>
                        <vs-dropdown-item @click="itemsPerPage = 4">
                            <span>4</span>
                        </vs-dropdown-item>
                        <vs-dropdown-item @click="itemsPerPage = 10">
                            <span>10</span>
                        </vs-dropdown-item>
                        <vs-dropdown-item @click="itemsPerPage = 15">
                            <span>15</span>
                        </vs-dropdown-item>
                        <vs-dropdown-item @click="itemsPerPage = 20">
                            <span>20</span>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </div>

            <template slot="thead">
                <vs-th sort-key="invoice_number">Invoice Number</vs-th>
                <vs-th sort-key="customer_name">Customer Name</vs-th>
                <vs-th sort-key="sales_name">Sales Name</vs-th>
                <vs-th sort-key="amount">Amount</vs-th>
                <vs-th sort-key="invoice_date">Invoice Date</vs-th>
                <vs-th sort-key="due_date">Due Date</vs-th>
                <vs-th sort-key="status">Status</vs-th>
                <vs-th sort-key="notes">Notes</vs-th>
                <vs-th>Action</vs-th>
            </template>

            <template slot-scope="{ data }">
                <tbody>
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            <p>{{ tr.invoice_number }}</p>
                        </vs-td>

                        <vs-td>
                            <p class="font-medium truncate">{{ tr.customer.full_name }}</p>
                        </vs-td>

                        <vs-td>
                            <p>{{ tr.user.name }}</p>
                        </vs-td>

                        <vs-td>
                            <p>${{ tr.amount }}</p>
                        </vs-td>

                        <vs-td>
                            <p>{{ tr.invoice_date | formatDate }}</p>
                        </vs-td>

                        <vs-td>
                            <p>{{ tr.due_date | formatDate }}</p>
                        </vs-td>

                        <vs-td>
                            <vs-chip :color="getInvoiceStatus(tr.status)">
                                {{ tr.status | title }}
                            </vs-chip>
                        </vs-td>

                        <vs-td>
                            <p>{{ tr.notes }}</p>
                        </vs-td>

                        <vs-td class="whitespace-no-wrap">
                            <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                                @click.stop="editData(tr)" />
                            <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                                class="ml-2" @click.stop="deleteData(tr.id)" />
                        </vs-td>
                    </vs-tr>
                </tbody>
            </template>
        </vs-table>
    </div>
</template>

<script>
    import DataViewSidebar from './DataViewSidebar.vue'
    import moduleInvoice from "@/store/invoice/moduleInvoice.js";
    import moduleContact from "@/store/contact/moduleContact.js";

    export default {
        components: {
            DataViewSidebar
        },
        data() {
            return {
                selected: [],
                // invoices: [],
                itemsPerPage: 4,
                isMounted: false,

                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
            };
        },
        computed: {
            currentPage() {
                if (this.isMounted) {
                    return this.$refs.table.currentx;
                }
                return 0;
            },
            invoices() {
                return this.$store.state.invoice.invoices;
            },
            queriedItems() {
                return this.$refs.table
                    ? this.$refs.table.queriedResults.length
                    : this.invoices.length;
            },
        },
        methods: {
            addNewData() {
                this.sidebarData = {
                    contacts: this.$store.state.contact.contacts
                };
                this.toggleDataSidebar(true);
            },
            deleteData(id) {
                this.$store.dispatch("invoice/removeItem", id).catch((err) => {
                    console.error(err);
                });
            },
            editData(data) {
                // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
                data.contacts = this.$store.state.contact.contacts
                this.sidebarData = data;
                this.toggleDataSidebar(true);
            },
            getInvoiceStatus(status) {
                if (status === "sent") return "primary";
                if (status === "paid") return "success";
                if (status === "draft") return "warning";
                if (status === "overdue") return "dark";
                if (status === "cancelled") return "danger";
                return "dark";
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val;
            },
        },
        created() {
            if (!moduleInvoice.isRegistered) {
                this.$store.registerModule("invoice", moduleInvoice);
                moduleInvoice.isRegistered = true;
            }
            this.$store.dispatch("invoice/fetchItems");

            if (!moduleContact.isRegistered) {
                this.$store.registerModule("contact", moduleContact);
                moduleContact.isRegistered = true;
            }
            this.$store.dispatch("contact/fetchItems");
        },
        mounted() {
            this.isMounted = true;
        },
    };
</script>

<style lang="scss">
    #data-list-list-view {
        .vs-con-table {

            /*
        Below media-queries is fix for responsiveness of action buttons
        Note: If you change action buttons or layout of this page, Please remove below style
      */
            @media (max-width: 689px) {
                .vs-table--search {
                    margin-left: 0;
                    max-width: unset;
                    width: 100%;

                    .vs-table--search-input {
                        width: 100%;
                    }
                }
            }

            @media (max-width: 461px) {
                .items-per-page-handler {
                    display: none;
                }
            }

            @media (max-width: 341px) {
                .data-list-btn-container {
                    width: 100%;

                    .dd-actions,
                    .btn-add-new {
                        width: 100%;
                        margin-right: 0 !important;
                    }
                }
            }

            .product-name {
                max-width: 23rem;
            }

            .vs-table--header {
                display: flex;
                flex-wrap: wrap;
                margin-left: 1.5rem;
                margin-right: 1.5rem;

                >span {
                    display: flex;
                    flex-grow: 1;
                }

                .vs-table--search {
                    padding-top: 0;

                    .vs-table--search-input {
                        padding: 0.9rem 2.5rem;
                        font-size: 1rem;

                        &+i {
                            left: 1rem;
                        }

                        &:focus+i {
                            left: 1rem;
                        }
                    }
                }
            }

            .vs-table {
                border-collapse: separate;
                border-spacing: 0 1.3rem;
                padding: 0 1rem;

                tr {
                    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);

                    td {
                        padding: 20px;

                        &:first-child {
                            border-top-left-radius: 0.5rem;
                            border-bottom-left-radius: 0.5rem;
                        }

                        &:last-child {
                            border-top-right-radius: 0.5rem;
                            border-bottom-right-radius: 0.5rem;
                        }
                    }

                    td.td-check {
                        padding: 20px !important;
                    }
                }
            }

            .vs-table--thead {
                th {
                    padding-top: 0;
                    padding-bottom: 0;

                    .vs-table-text {
                        text-transform: uppercase;
                        font-weight: 600;
                    }
                }

                th.td-check {
                    padding: 0 15px !important;
                }

                tr {
                    background: none;
                    box-shadow: none;
                }
            }

            .vs-table--pagination {
                justify-content: center;
            }
        }
    }
</style>