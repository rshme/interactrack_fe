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
                <!-- Customer Name (vs-select) -->
                <vs-select label="Customer Name" v-model="dataCustomerId" class="mt-5 w-full" name="customer-id"
                    v-validate="'required'">
                    <vs-select-item v-for="contact in contacts" :key="contact.id" :value="contact.id"
                        :text="contact.full_name" />
                </vs-select>
                <span class="text-danger text-sm" v-show="errors.has('customer-id')">
                    {{ errors.first("customer-id") }}
                </span>

                <!-- Type -->
                <vs-select v-model="dataType" label="Type" class="mt-5 w-full" name="item-type"
                    v-validate="'required'">
                    <vs-select-item :key="item.value" :value="item.value" :text="item.text"
                        v-for="item in type_choices" />
                </vs-select>
                <span class="text-danger text-sm" v-show="errors.has('item-type')">
                    {{ errors.first("item-type") }}
                </span>

                <!-- Subject -->
                <vs-input label="Subject" v-model="dataSubject" class="mt-5 w-full" name="subject"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('subject')">
                    {{ errors.first("subject") }}
                </span>

                <!-- Description -->
                <vs-textarea label="Description" v-model="dataDescription" class="mt-5 w-full" name="description"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('description')">
                    {{ errors.first("description") }}
                </span>

                <!-- Interaction Date -->
                <div class="mt-5">
                    <datepicker placeholder="Interaction Date" v-model="dataInteractionDate"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('interaction-date')">
                        {{ errors.first("interaction-date") }}
                    </span>
                </div>

                <!-- Status -->
                <vs-select v-model="dataStatus" label="Status" class="mt-5 w-full" name="item-status"
                    v-validate="'required'">
                    <vs-select-item :key="item.value" :value="item.value" :text="item.text"
                        v-for="item in status_choices" />
                </vs-select>
                <span class="text-danger text-sm" v-show="errors.has('item-status')">
                    {{ errors.first("item-status") }}
                </span>

                <!-- Description -->
                <vs-textarea label="Outcome" v-model="dataOutcome" class="mt-5 w-full" name="outcome"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('outcome')">
                    {{ errors.first("outcome") }}
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
                dataCustomerId: null,  // Changed from dataCustomerName to dataCustomerId
                dataType: "",
                dataSubject: "",
                dataDescription: "",
                dataInteractionDate: "",
                dataStatus: "planned",
                dataOutcome: "",

                status_choices: [
                    { text: "Planned", value: "planned" },
                    { text: "Completed", value: "completed" },
                    { text: "Follow Up Required", value: "follow-up-required" },
                    { text: "Cancelled", value: "cancelled" },
                ],

                type_choices: [
                    { text: "E-Mail", value: "email" },
                    { text: "Call", value: "call" },
                    { text: "Meeting", value: "meeting" },
                    { text: "Note", value: "note" },
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
                    console.log(this.data.contacts)
                    const { customer, customer_id, type, subject, description, interaction_date, status, outcome, id } = JSON.parse(
                        JSON.stringify(this.data)
                    );
                    
                    this.dataId = id;
                    this.dataCustomerId = customer.id;  // Setting customer_id from the data object
                    this.dataType = type;
                    this.dataSubject = subject;
                    this.dataDescription = description;
                    this.dataInteractionDate = interaction_date;
                    this.dataStatus = status;
                    this.dataOutcome = outcome;
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
                    this.dataCustomerId &&  // Check for customer_id instead of customer_name
                    this.dataType &&
                    this.dataSubject &&
                    this.dataDescription &&
                    this.dataInteractionDate &&
                    this.dataStatus &&
                    this.dataOutcome
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
                this.dataCustomerId = null;  // Reset customer_id
                this.dataType = "";
                this.dataSubject = "";
                this.dataDescription = "";
                this.dataInteractionDate = "";
                this.dataStatus = "planned";
                this.dataOutcome = "";
            },
            submitData() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        const obj = {
                            id: this.dataId,
                            customer_id: this.dataCustomerId,  // Send customer_id instead of customer_name
                            type: this.dataType,
                            subject: this.dataSubject,
                            description: this.dataDescription,
                            interaction_date: this.dataInteractionDate,
                            status: this.dataStatus,
                            outcome: this.dataOutcome,
                        };

                        if (this.dataId !== null && this.dataId >= 0) {
                            this.$store.dispatch("interaction/updateItem", obj).catch((err) => {
                                console.error(err);
                            });
                        } else {
                            delete obj.id;
                            this.$store.dispatch("interaction/addItem", obj).catch((err) => {
                                console.error(err);
                            });
                        }

                        this.$emit("closeSidebar");
                        this.$store.dispatch("interaction/fetchItems");
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