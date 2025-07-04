import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { StockOutputService } from "../../Services/StockOutputService";

const StockOutputTable = ({ stockOutputs }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'productName', headerName: 'Product', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'unitPrice', headerName: 'Unit Price', width: 130 },
    { field: 'totalPrice', headerName: 'Total Price', width: 130 },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={stockOutputs}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default StockOutputTable;
