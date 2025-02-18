import FooterTd from "./footer-td";
import { clsName } from "../util";
import { COMPS_NAME, EMIT_EVENTS, COMPS_CUSTOM_ATTRS } from "../util/constant";
import VueDomResizeObserver from "../../../src/comps/resize-observer";
import emitter from "../../../src/mixins/emitter";
export default {
    name: COMPS_NAME.VE_TABLE_BODY_TR,
    mixins: [emitter],
    props: {
        rowData: {
            type: Object,
            required: true
        },
        rowIndex: {
            type: Number,
            required: true
        },
        colgroups: {
            type: Array,
            required: true
        },
        rowKeyFieldName: {
            type: String,
            default: null
        },
        // cell style option
        cellStyleOption: {
            type: Object,
            default: function() {
                return null;
            }
        },
        // cell span option
        cellSpanOption: {
            type: Object,
            default: function() {
                return null;
            }
        },
        // highlight row key
        highlightRowKey: {
            type: [String, Number],
            default: null
        },
        // event custom option
        eventCustomOption: {
            type: Object,
            default: function() {
                return null;
            }
        },
        // cell selection key data
        cellSelectionKeyData: {
            type: Object,
            default: function() {
                return null;
            }
        },
        // footer rows
        footerRows: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // fixed footer
        fixedFooter: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        // current row key
        currentRowKey() {
            const { rowKeyFieldName } = this;
            return rowKeyFieldName ? this.rowData[rowKeyFieldName] : null;
        },
        // tr class
        trClass() {
            let result = null;

            result = {
                [clsName("footer-tr")]: true
            };

            return result;
        }
    },

    methods: {
        // tr height change
        trHeightChange({ height }) {
            /*  this.$emit(EMIT_EVENTS.Footer_TR_HEIGHT_CHANGE, {
                rowIndex: this.rowIndex,
                height: height
            }); */

            this.dispatch(
                COMPS_NAME.VE_TABLE,
                EMIT_EVENTS.Footer_TR_HEIGHT_CHANGE,
                {
                    rowIndex: this.rowIndex,
                    height: height
                }
            );
        },
        // click
        rowClick(e, fn) {
            fn && fn(e);

            const { rowData, rowIndex } = this;

            /*   this.dispatch(COMPS_NAME.VE_TABLE_BODY, EMIT_EVENTS.BODY_TR_CLICK, {
                rowData,
                rowIndex
            }); */
        },
        // dblclick
        rowDblclick(e, fn) {
            fn && fn(e);
        },
        // contextmenu
        rowContextmenu(e, fn) {
            fn && fn(e);
        },
        // mouseenter
        rowMouseenter(e, fn) {
            fn && fn(e);
        },
        // mouseleave
        rowMouseleave(e, fn) {
            fn && fn(e);
        }
    },

    render() {
        const {
            colgroups,
            cloneTableData,
            expandOption,
            rowExpandClick,
            expandRowChange,
            isExpandRow,
            getExpandRowComp,
            expandedRowkeys,
            checkboxOptipon,
            rowKeyFieldName,
            rowIndex,
            rowData,
            internalCheckboxSelectedRowKeys,
            internalRadioSelectedRowKey,
            radioOption,
            cellStyleOption,
            eventCustomOption
        } = this;

        // get td content
        const getTdContent = () => {
            return colgroups.map(column => {
                const tdProps = {
                    key: column.key,
                    props: {
                        rowIndex,
                        rowData,
                        column,
                        colgroups,
                        rowKeyFieldName,
                        cellStyleOption,
                        cellSelectionKeyData: this.cellSelectionKeyData,
                        footerRows: this.footerRows,
                        fixedFooter: this.fixedFooter,
                        cellSpanOption: this.cellSpanOption,
                        eventCustomOption: this.eventCustomOption
                    }
                };
                return <FooterTd {...tdProps} />;
            });
        };

        let result = null;

        // custom on row event
        let customEvents = {};
        if (eventCustomOption) {
            const { footerRowEvents } = eventCustomOption;
            customEvents = footerRowEvents
                ? footerRowEvents({ row: rowData, rowIndex })
                : {};
        }

        const {
            click,
            dblclick,
            contextmenu,
            mouseenter,
            mouseleave
        } = customEvents;

        const events = {
            click: e => {
                this.rowClick(e, click);
            },
            dblclick: e => {
                this.rowDblclick(e, dblclick);
            },
            contextmenu: e => {
                this.rowContextmenu(e, contextmenu);
            },
            mouseenter: e => {
                this.rowMouseenter(e, mouseenter);
            },
            mouseleave: e => {
                this.rowMouseleave(e, mouseleave);
            }
        };

        const props = {
            class: this.trClass,
            props: {
                tagName: "tr"
            },
            attrs: {
                [COMPS_CUSTOM_ATTRS.BODY_ROW_KEY]: this.currentRowKey
            },
            nativeOn: events,
            on: {
                "on-dom-resize-change": this.trHeightChange
            }
        };

        return (
            <VueDomResizeObserver {...props}>
                {getTdContent()}
            </VueDomResizeObserver>
        );
    }
};
