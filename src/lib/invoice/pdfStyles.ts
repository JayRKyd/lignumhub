import { StyleSheet } from '@react-pdf/renderer';

const colors = {
    // Grays
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    'gray550/900': 'rgb(115 115 115 / 0.9)',
    // Primary - Teal/Dark blue for table headers
    primary: '#1a5f5a',
    primaryLight: '#e8f5f4',
    // White
    white: '#ffffff',
}

export const pdfTypography = StyleSheet.create({
    // Large invoice title
    invoiceTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.gray800,
        textAlign: 'right',
    },
    // Section headers like "BILL TO"
    sectionLabel: {
        fontSize: 10,
        fontWeight: 'semibold',
        textTransform: 'uppercase',
        color: colors.gray400,
        letterSpacing: 0.5,
    },
    // Company name / client name
    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray800,
    },
    // Regular body text
    bodyText: {
        fontSize: 10,
        color: colors.gray600,
        lineHeight: 1.4,
    },
    // Table header text
    tableHeader: {
        fontSize: 10,
        fontWeight: 'semibold',
        color: colors.white,
        textTransform: 'uppercase',
    },
    // Table cell text
    tableCell: {
        fontSize: 10,
        color: colors.gray700,
    },
    // Table cell description (smaller, gray)
    tableCellDescription: {
        fontSize: 9,
        color: colors.gray500,
    },
    // Invoice metadata labels
    metaLabel: {
        fontSize: 10,
        fontWeight: 'medium',
        color: colors.gray500,
        textAlign: 'right',
    },
    // Invoice metadata values
    metaValue: {
        fontSize: 10,
        fontWeight: 'medium',
        color: colors.gray800,
    },
    // Total amount (large)
    totalAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray800,
    },
    // Subtotal labels
    subtotalLabel: {
        fontSize: 10,
        color: colors.gray600,
    },
    // Subtotal values
    subtotalValue: {
        fontSize: 10,
        color: colors.gray700,
        textAlign: 'right',
    },
    // Legacy styles for backward compatibility
    title: {
        fontSize: 11,
        fontWeight: "semibold",
        textTransform: "uppercase",
        color: colors.gray400
    },
    subTitle: {
        fontSize: 12,
        fontWeight: "medium",
    },
    text2xl: {
        fontSize: 24,
        fontWeight: 'medium'
    },
    description: {
        color: colors['gray550/900'],
        fontSize: 12
    },
    itemDescription: {
        color: colors.gray600,
        fontSize: 12,
        fontWeight: "medium",
        flexWrap: 'wrap'
    },
    amount: {
        fontSize: 16,
        fontWeight: "medium",
        flexWrap: 'wrap'
    },
    paymentTitle: {
        fontSize: 12,
        fontWeight: "medium",
        flexWrap: 'wrap',
        color: colors.gray500
    }
})

export const pdfUtils = StyleSheet.create({
    flexRowBetween: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    borderTop: { borderTop: `1px solid ${colors.gray200}`, borderTopStyle: 'dashed', },
    borderBottom: { borderBottom: `1px solid ${colors.gray200}`, borderBottomStyle: 'dashed', },
    borderLeft: { borderLeft: `1px solid ${colors.gray200}`, borderLeftStyle: 'dashed', },
    borderRight: { borderRight: `1px solid ${colors.gray200}`, borderRightStyle: 'dashed', },
    flexRowItemCenter: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    flexRowItemSpaceAround: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    flexColBetween: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
})

export const pdfContainers = StyleSheet.create({
    page: {
        fontFamily: "Geist",
        backgroundColor: colors.white,
        paddingVertical: 40,
    },
    // New professional layout containers
    header: {
        paddingHorizontal: 40,
        paddingBottom: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        textAlign: 'right',
    },
    companyInfo: {
        marginTop: 8,
    },
    billToSection: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billToLeft: {
        flex: 1,
    },
    billToRight: {
        width: 200,
    },
    metaRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    totalBox: {
        backgroundColor: colors.gray100,
        padding: 8,
        marginTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tableContainer: {
        paddingHorizontal: 40,
        marginTop: 20,
    },
    tableHeaderRow: {
        backgroundColor: colors.primary,
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottom: `1px solid ${colors.gray200}`,
    },
    totalsSection: {
        paddingHorizontal: 40,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalsBox: {
        width: 250,
    },
    totalsRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottom: `1px solid ${colors.gray200}`,
    },
    totalsFinalRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginTop: 4,
        borderTop: `2px solid ${colors.gray300}`,
    },
    finalTotalBox: {
        backgroundColor: colors.gray100,
        padding: 10,
        marginTop: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    noteSection: {
        paddingHorizontal: 40,
        marginTop: 30,
    },
    bankDetailsSection: {
        paddingHorizontal: 40,
        marginTop: 30,
        paddingTop: 20,
        borderTop: `1px solid ${colors.gray200}`,
    },
    // Legacy containers
    invoiceTerms: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        display: 'flex',
        alignItems: "center",
        flexDirection: 'row',
    },
    YourDetails: {
        paddingHorizontal: 40,
        paddingVertical: 16,
        flex: 1
    },
    CompanyDetails: {
        paddingHorizontal: 40,
        paddingVertical: 16,
        flex: 1
    },
    imageContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: 40,
        marginBottom: 12,
    }
})

export { colors as pdfColors };
