import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";

export default function Home() {
  const [ranking, setRanking] = useState([]);
  const [selectedArea, setSelectedArea] = useState("すべて");
  const [areas, setAreas] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  type RankingItem = {
    id: number;
    accountName: string;
    profileUrl: string;
    followers: number;
    area: string;
    storeName: string;
    imageUrl: string;
  };

  useEffect(() => {
    axios.get<RankingItem[]>("/api/ranking").then((res) => {
      setRanking(res.data);

      const uniqueAreas = Array.from(new Set(res.data.map((item) => item.area)));
      setAreas(["すべて", ...uniqueAreas]);
    });
  }, []);

  const filteredRanking =
    selectedArea === "すべて"
      ? ranking
      : ranking.filter((item) => item.area === selectedArea);

  const sortedRanking = [...filteredRanking].sort((a, b) => b.followers - a.followers);

  const totalPages = Math.ceil(sortedRanking.length / itemsPerPage);
  const paginatedRanking = sortedRanking.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAreaChange = (e: any) => {
    setSelectedArea(e.target.value);
    setCurrentPage(1); // 地域を変えたらページリセット
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        sx={{
          fontSize: {
            xs: '1.4rem',
            md: '2.125rem',
          },
        }}
        gutterBottom
      >
        インスタグラマーランキング
      </Typography>

      <FormControl fullWidth sx={{ mb: 4, width: 100 }}>
        <InputLabel id="area-select-label">地域</InputLabel>
        <Select
          labelId="area-select-label"
          value={selectedArea}
          label="地域"
          onChange={handleAreaChange}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              height: {
                xs: '40px',
                md: '56px',
              },
            },
            '& .MuiSelect-select': {
              minHeight: {
                xs: 'auto',
                md: 'auto',
              },
              height: {
                xs: '40px',
                md: '56px',
              },
              paddingTop: {
                xs: '8px',
                md: '16.5px',
              },
              paddingBottom: {
                xs: '8px',
                md: '16.5px',
              },
            },
            '& .MuiInputBase-root': {
              height: {
                xs: '40px',
                md: '56px',
              },
            },
          }}
        >
          {areas.map((area, idx) => (
            <MenuItem key={idx} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {paginatedRanking.map((user, index) => (
        <Card key={user.id} sx={{ mb: 2, display: "flex", alignItems: "center", p: 2 }}>
          <Typography variant="h6" sx={{ width: "32px", mr: 2 }}>
            {(currentPage - 1) * itemsPerPage + index + 1}
          </Typography>
          <Avatar
            src={user.imageUrl}
            alt={user.accountName}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <CardContent sx={{ flexGrow: 1, p: 0 }}>
            <Typography
              variant="subtitle1"
              component="a"
              href={user.profileUrl}
              target="_blank"
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              @{user.accountName}
            </Typography>
            <Typography variant="body2">
              フォロワー: {user.followers.toLocaleString()}人
            </Typography>
            <Typography variant="body2" color="text.secondary">
              店舗名: {user.storeName} / 地域: {user.area}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* ページネーション */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
}
