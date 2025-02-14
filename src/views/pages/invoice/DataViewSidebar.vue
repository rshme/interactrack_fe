<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
        class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="mt-6 flex items-center justify-between px-6">
            <h4>
                {{ Object.entries(this.data).length === 1 ? "ADD NEW" : "UPDATE" }} ITEM
            </h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>

        <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">
            <div class="p-6">
                <!-- Invoice Number -->
                <vs-input label="Invoice Number" v-model="dataInvoiceNumber" class="mt-5 w-full" name="invoice-number"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('invoice-number')">
                    {{ errors.first("invoice-number") }}
                </span>

                <!-- Customer Name -->
                <vs-select label="Customer Name" v-model="dataCustomerId" class="mt-5 w-full" name="customer-id"
                    v-validate="'required'">
                    <vs-select-item v-for="contact in contacts" :key="contact.id" :value="contact.id"
                        :text="contact.full_name" />
                </vs-select>
                <span class="text-danger text-sm" v-show="errors.has('customer-id')">
                    {{ errors.first("customer-id") }}
                </span>

                <!-- Amount -->
                <vs-input label="Amount" v-model="dataAmount" class="mt-5 w-full" name="amount"
                    v-validate="'required|numeric'" />
                <span class="text-danger text-sm" v-show="errors.has('amount')">
                    {{ errors.first("amount") }}
                </span>

                <!-- Invoice Date -->
                <div class="mt-5">
                    <datepicker placeholder="Invoice Date" v-model="dataInvoiceDate"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('invoice-date')">
                        {{ errors.first("invoice-date") }}
                    </span>
                </div>

                <!-- Due Date -->
                <div class="mt-5">
                    <datepicker placeholder="Due Date" v-model="dataDueDate"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('due-date')">
                        {{ errors.first("due-date") }}
                    </span>
                </div>

                <!-- Status -->
                <vs-select v-model="dataStatus" label="Status" class="mt-5 w-full" name="status"
                    v-validate="'required'">
                    <vs-select-item :key="item.value" :value="item.value" :text="item.text"
                        v-for="item in status_choices" />
                </vs-select>
                <span class="text-danger text-sm" v-show="errors.has('status')">
                    {{ errors.first("status") }}
                </span>

                <!-- Notes -->
                <vs-textarea label="Notes" v-model="dataNotes" class="mt-5 w-full" name="notes"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('notes')">
                    {{ errors.first("notes") }}
                </span>
            </div>
        </component>

        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">Submit</vs-button>
            <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from "vue-perfect-scrollbar";
    import Datepicker from 'vuejs-datepicker';

    export default {
        props: {
            isSidebarActive: {
                type: Boolean,
                required: true,
            },
            data: {
                type: Object,
                default: () => { },
            },
        },
        components: {
            VuePerfectScrollbar,
            Datepicker
        },
        data() {
            return {
                dataId: null,
                dataInvoiceNumber: "",
                dataCustomerId: null,  // Customer ID
                dataAmount: "",  // Amount
                dataInvoiceDate: null,  // Invoice Date
                dataDueDate: null,  // Due Date
                dataStatus: "pending",  // Status (default to 'pending')
                dataNotes: "",  // Notes

                status_choices: [
                    { text: "Draft", value: "draft" },
                    { text: "Sent", value: "sent" },
                    { text: "Paid", value: "paid" },
                    { text: "Overdue", value: "overdue" },
                    { text: "Cancelled", value: "cancelled" },
                ],

                settings: {
                    maxScrollbarLength: 60,
                    wheelSpeed: 0.6,
                },
            };
        },
        watch: {
            isSidebarActive(val) {
                if (!val) return;
                if (Object.entries(this.data).length === 0) {
                    this.initValues();
                    this.$validator.reset();
                } else {
                    const {
                        invoice_number, customer, amount, invoice_date, due_date, status, notes, id 
                    } = JSON.parse(JSON.stringify(this.data));

                    this.dataId = id;
                    this.dataInvoiceNumber = invoice_number;
                    this.dataCustomerId = customer.id;
                    this.dataAmount = amount;
                    this.dataInvoiceDate = invoice_date;
                    this.dataDueDate = due_date;
                    this.dataStatus = status;
                    this.dataNotes = notes;
                    this.initValues();
                }
            },
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive;
                },
                set(val) {
                    if (!val) {
                        this.$emit("closeSidebar");
                    }
                },
            },
            isFormValid() {
                return (
                    !this.errors.any() &&
                    this.dataCustomerId &&  // Check for customer_id
                    this.dataInvoiceNumber &&
                    this.dataAmount &&
                    this.dataInvoiceDate &&
                    this.dataDueDate &&
                    this.dataStatus &&
                    this.dataNotes
                );
            },
            scrollbarTag() {
                return this.$store.getters.scrollbarTag;
            },
            contacts() {
                return this.data.contacts
            },
        },
        methods: {
            initValues() {
                if (this.data.id) return;
                this.dataId = null;
                this.dataInvoiceNumber = "";
                this.dataCustomerId = null;
                this.dataAmount = "";
                this.dataInvoiceDate = null;
                this.dataDueDate = null;
                this.dataStatus = "draft";
                this.dataNotes = "";
            },
            submitData() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        const obj = {
                            id: this.dataId,
                            invoice_number: this.dataInvoiceNumber,
                            customer_id: this.dataCustomerId,  // Send customer_id
                            amount: parseInt(this.dataAmount),
                            invoice_date: this.dataInvoiceDate,
                            due_date: this.dataDueDate,
                            status: this.dataStatus,
                            notes: this.dataNotes,
                        };

                        if (this.dataId !== null && this.dataId >= 0) {
                            this.$store.dispatch("invoice/updateItem", obj).catch((err) => {
                                console.error(err);
                            });
                        } else {
                            delete obj.id;
                            this.$store.dispatch("invoice/addItem", obj).catch((err) => {
                                console.error(err);
                            });
                        }

                        this.$emit("closeSidebar");
                        this.$store.dispatch("invoice/fetchItems");
                        this.initValues();
                    }
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .add-new-data-sidebar {
        ::v-deep .vs-sidebar--background {
            z-index: 52010;
        }

        ::v-deep .vs-sidebar {
            z-index: 52010;
            width: 400px;
            max-width: 90vw;

            .img-upload {
                margin-top: 2rem;

                .con-img-upload {
                    padding: 0;
                }

                .con-input-upload {
                    width: 100%;
                    margin: 0;
                }
            }
        }
    }

    .scroll-area--data-list-add-new {
        // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
        height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

        &:not(.ps) {
            overflow-y: auto;
        }
    }
</style>