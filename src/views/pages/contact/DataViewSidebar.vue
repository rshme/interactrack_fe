<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
        class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="mt-6 flex items-center justify-between px-6">
            <h4>
                {{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM
            </h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>

        <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">
            <div class="p-6">
                <!-- Customer Name -->
                <vs-input label="Customer Name" v-model="dataCustomerName" class="mt-5 w-full" name="customer-name"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('customer-name')">
                    {{ errors.first("customer-name") }}
                </span>

                <!-- Company Name -->
                <vs-input label="Company Name" v-model="dataCompanyName" class="mt-5 w-full" name="company-name"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('company-name')">
                    {{ errors.first("company-name") }}
                </span>

                <!-- Industry -->
                <vs-input label="Industry" v-model="dataIndustry" class="mt-5 w-full" name="industry"
                    v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('industry')">
                    {{ errors.first("industry") }}
                </span>

                <!-- E-mail -->
                <vs-input label="E-mail" v-model="dataEmail" class="mt-5 w-full" name="email" v-validate="'required|email'" />
                <span class="text-danger text-sm" v-show="errors.has('email')">
                    {{ errors.first("email") }}
                </span>

                <!-- Phone -->
                <vs-input label="Phone" v-model="dataPhone" class="mt-5 w-full" name="phone" v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('phone')">
                    {{ errors.first("phone") }}
                </span>

                <!-- Address -->
                <vs-textarea label="Address" v-model="dataAddress" class="mt-5 w-full" name="address" v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('address')">
                    {{ errors.first("address") }}
                </span>

                <!-- Status (Dropdown) -->
                <vs-select v-model="dataStatus" label="Status" class="mt-5 w-full" name="item-status" v-validate="'required'">
                    <vs-select-item :key="item.value" :value="item.value" :text="item.text" v-for="item in status_choices" />
                </vs-select>
                <span class="text-danger text-sm" v-show="errors.has('item-status')">
                    {{ errors.first("item-status") }}
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

export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true,
        },
        data: {
            type: Object,
            default: () => {},
        },
    },
    components: {
        VuePerfectScrollbar,
    },
    data() {
        return {
            dataId: null,
            dataCustomerName: "",
            dataCompanyName: "",
            dataIndustry: "",
            dataEmail: "",
            dataPhone: "",
            dataAddress: "",
            dataStatus: "pending",

            status_choices: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" }
            ],

            settings: {
                // perfectscrollbar settings
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
                const { full_name, company_name, industry, email, phone, address, status, id } = JSON.parse(
                    JSON.stringify(this.data)
                );
                this.dataId = id;
                this.dataCustomerName = full_name;
                this.dataCompanyName = company_name;
                this.dataIndustry = industry;
                this.dataEmail = email;
                this.dataPhone = phone;
                this.dataAddress = address;
                this.dataStatus = status;
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
                this.dataCustomerName &&
                this.dataCompanyName &&
                this.dataIndustry &&
                this.dataEmail &&
                this.dataPhone &&
                this.dataAddress &&
                this.dataStatus
            );
        },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag;
        },
    },
    methods: {
        initValues() {
            console.log(this.data)
            if (this.data.id) return;
            this.dataId = null;
            this.dataCustomerName = "";
            this.dataCompanyName = "";
            this.dataIndustry = "";
            this.dataEmail = "";
            this.dataPhone = "";
            this.dataAddress = "";
            this.dataStatus = "active";
        },
        submitData() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    const nameParts = this.dataCustomerName.split(' ');

                    const obj = {
                        id: this.dataId,
                        first_name: nameParts[0],
                        last_name: nameParts.slice(1).join(' '),
                        company_name: this.dataCompanyName,
                        industry: this.dataIndustry,
                        email: this.dataEmail,
                        phone: this.dataPhone,
                        address: this.dataAddress,
                        status: this.dataStatus,
                    };

                    if (this.dataId !== null && this.dataId >= 0) {
                        this.$store.dispatch("contact/updateItem", obj).catch((err) => {
                            console.error(err);
                        });
                    } else {
                        delete obj.id;
                        this.$store.dispatch("contact/addItem", obj).catch((err) => {
                            console.error(err);
                        });
                    }

                    this.$emit("closeSidebar");
                    this.$store.dispatch("contact/fetchItems");
                    this.initValues();
                }
            });
        },
    },
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