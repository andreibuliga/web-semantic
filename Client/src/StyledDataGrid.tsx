import { styled } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import {
	DataGrid,
	GridRowsProp,
	gridPageCountSelector,
	gridPageSelector,
	useGridApiContext,
	useGridSelector,
} from "@mui/x-data-grid";
function CustomPagination() {
	const apiRef = useGridApiContext();
	const page = useGridSelector(apiRef, gridPageSelector);
	const pageCount = useGridSelector(apiRef, gridPageCountSelector);

	return (
		<Pagination
			color="primary"
			count={pageCount}
			page={page + 1}
			onChange={(event, value) => apiRef.current.setPage(value - 1)}
		/>
	);
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
	border: 0,
	color:
		theme.palette.mode === "light"
			? "rgba(0,0,0,.85)"
			: "rgba(255,255,255,0.85)",
	fontFamily: [
		"-apple-system",
		"BlinkMacSystemFont",
		'"Segoe UI"',
		"Roboto",
		'"Helvetica Neue"',
		"Arial",
		"sans-serif",
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(","),
	WebkitFontSmoothing: "auto",
	letterSpacing: "normal",
	"& .MuiDataGrid-columnsContainer": {
		backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
	},
	"& .MuiDataGrid-iconSeparator": {
		display: "none",
	},
	"& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
		borderRight: `1px solid ${
			theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
		}`,
	},
	"& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
		borderBottom: `1px solid ${
			theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
		}`,
	},
	"& .MuiDataGrid-cell": {
		color:
			theme.palette.mode === "light"
				? "rgba(0,0,0,.85)"
				: "rgba(255,255,255,0.65)",
	},
	"& .MuiPaginationItem-root": {
		borderRadius: "50%",
		"&.Mui-selected": {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
		},
	},
	"& .cell-center": {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	"& .MuiDataGrid-toolbarContainer": {
		justifyContent: "center",
	},
}));

interface CustomDataGridProps {
	rows: GridRowsProp;
	columns: any[];
	onButtonClick: () => void;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({ rows, columns }) => {
	return (
		<StyledDataGrid
			rows={rows}
			columns={columns}
			autoHeight
			style={{
				width: "95%",
			}}
			getRowId={(row) => row.id}
			sx={{
				border: "1.5px solid #e7e7e7",
				"& .MuiDataGrid-cell:hover": {
					color: "primary.main",
				},
			}}
			components={{
				Pagination: CustomPagination,
			}}
		/>
	);
};

export default CustomDataGrid;
