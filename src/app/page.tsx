"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Instagram, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"

interface Influencer {
  id: number
  username: string
  storeName: string
  followers: number
  popularity: number
  avatar?: string
  region?: string
}

export default function InstagramRanking() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [region, setRegion] = useState("all")
  const itemsPerPage = 10

  // Mock data for demonstration since API is not accessible
  const mockData: Influencer[] = [
    { id: 1, username: "tanaka_misaki", storeName: "田中美咲", followers: 2500000, popularity: 95, region: "tokyo" },
    { id: 2, username: "sato_kenta", storeName: "佐藤健太", followers: 1800000, popularity: 88, region: "osaka" },
    { id: 3, username: "yamada_hanako", storeName: "山田花子", followers: 1500000, popularity: 82, region: "kyoto" },
    { id: 4, username: "suzuki_taro", storeName: "鈴木太郎", followers: 1200000, popularity: 79, region: "nagoya" },
    { id: 5, username: "takahashi_ai", storeName: "高橋愛", followers: 980000, popularity: 75, region: "fukuoka" },
    { id: 6, username: "ito_naoki", storeName: "伊藤直樹", followers: 850000, popularity: 71, region: "sapporo" },
    { id: 7, username: "watanabe_miho", storeName: "渡辺美穂", followers: 720000, popularity: 68, region: "tokyo" },
    { id: 8, username: "nakamura_masato", storeName: "中村雅人", followers: 650000, popularity: 65, region: "osaka" },
    {
      id: 9,
      username: "kobayashi_sakura",
      storeName: "小林さくら",
      followers: 580000,
      popularity: 62,
      region: "kyoto",
    },
    { id: 10, username: "kato_sho", storeName: "加藤翔", followers: 520000, popularity: 58, region: "nagoya" },
    { id: 11, username: "yoshida_mai", storeName: "吉田麻衣", followers: 480000, popularity: 55, region: "fukuoka" },
    {
      id: 12,
      username: "matsumoto_daisuke",
      storeName: "松本大輔",
      followers: 420000,
      popularity: 52,
      region: "sapporo",
    },
  ]

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://ranking-backend.cspm.fun/api/influencers/all")

        if (response.status !== 200) {
          throw new Error("API not available")
        }

        console.log("response.data:", response.data.items)
        setInfluencers(response.data.items)
      } catch (err) {
        console.log("API not available, using mock data")
        console.error("Error details:", err)
        setInfluencers(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchInfluencers()
  }, [])

  // Reset to page 1 when region changes
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion)
    setCurrentPage(1)
  }

  // Get unique regions from influencers data
  const uniqueRegions = Array.from(new Set(influencers.map((inf) => inf.region).filter(Boolean)))

  const filteredInfluencers = region === "all" ? influencers : influencers.filter((inf) => inf.region === region)

  const totalPages = Math.ceil(filteredInfluencers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentInfluencers = filteredInfluencers.slice(startIndex, startIndex + itemsPerPage)

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">インスタグラマーランキング</h1>

          {/* Category Filter */}
          <div className="mb-6">
            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-48 mx-auto">
                <SelectValue placeholder="地域を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {uniqueRegions.map((regionOption) => (
                  <SelectItem key={regionOption} value={regionOption}>
                    {regionOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ranking List */}
        <div className="space-y-4 mb-8">
          {currentInfluencers.length > 0 ? (
            currentInfluencers.map((influencer, index) => {
              const rank = startIndex + index + 1
              return (
                <Card key={influencer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            rank === 1
                              ? "bg-yellow-500"
                              : rank === 2
                                ? "bg-gray-400"
                                : rank === 3
                                  ? "bg-amber-600"
                                  : "bg-gray-600"
                          }`}
                        >
                          {rank}
                        </div>
                      </div>

                      {/* Avatar */}
                      {/* <Avatar className="w-16 h-16">
                        <AvatarImage src={influencer.avatar || "/placeholder.svg"} alt={influencer.username} />
                        <AvatarFallback>
                          <Instagram className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar> */}

                      {/* Info */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900">@{influencer.username}</h3>
                        <p className="text-gray-600">{influencer.storeName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {influencer.region && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {influencer.region}
                            </span>
                          )}
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            人気度: {influencer.popularity}
                          </span>
                        </div>
                      </div>

                      {/* Followers */}
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Users className="w-5 h-5" />
                          <span className="text-2xl font-bold">{formatFollowers(influencer.followers)}</span>
                        </div>
                        <p className="text-sm text-gray-600">フォロワー</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">該当するインフルエンサーが見つかりません</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-gray-600">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
