"use client";

import type React from "react";

import ReportStatusBadge from "@/components/report-status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { reports } from "@/lib/data";
import {
	AlertTriangle,
	ChevronLeft,
	Clock,
	MapPin,
	MessageSquare,
	Share2,
	ThumbsDown,
	ThumbsUp,
	User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReportDetail({ params }: { params: { id: string } }) {
	// In a real app, we would fetch the report data from an API
	const report = reports.find((r) => r.id === params.id) || reports[0];

	const [activeTab, setActiveTab] = useState("details");
	const [comment, setComment] = useState("");
	const [feedback, setFeedback] = useState<"satisfied" | "unsatisfied" | null>(
		null,
	);

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real app, we would submit the comment to an API
		setComment("");
		alert("Comment submitted!");
	};

	return (
		<div className="container px-4 py-6 space-y-6">
			<div className="flex items-center space-x-2">
				<Link href="/">
					<Button variant="ghost" size="icon" className="rounded-full">
						<ChevronLeft className="h-5 w-5" />
					</Button>
				</Link>
				<h1 className="text-xl font-bold">Report Details</h1>
				<div className="ml-auto flex gap-2">
					<Button variant="ghost" size="icon" className="rounded-full">
						<Share2 className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="space-y-6">
				<div className="relative">
					<img
						src={report.imageUrl || "/placeholder.svg"}
						alt={report.title}
						className="w-full h-[220px] object-cover rounded-xl shadow-md"
					/>
					<div className="absolute top-3 right-3">
						<ReportStatusBadge status={report.status} size="md" />
					</div>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<h2 className="text-xl font-bold">{report.title}</h2>
						<div className="flex flex-wrap gap-4 text-sm">
							<div className="flex items-center text-muted-foreground">
								<MapPin className="w-4 h-4 mr-1" />
								<span>{report.location}</span>
							</div>
							<div className="flex items-center text-muted-foreground">
								<Clock className="w-4 h-4 mr-1" />
								<span>{report.date}</span>
							</div>
							<div className="flex items-center text-muted-foreground">
								<User className="w-4 h-4 mr-1" />
								<span>{report.reporter}</span>
							</div>
						</div>
					</div>

					<Tabs
						defaultValue="details"
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<TabsList className="grid grid-cols-3 w-full">
							<TabsTrigger value="details">Details</TabsTrigger>
							<TabsTrigger value="updates">Updates</TabsTrigger>
							<TabsTrigger value="comments">Comments</TabsTrigger>
						</TabsList>

						<TabsContent value="details" className="space-y-6 mt-4">
							<Card className="border-muted/80 shadow-sm">
								<CardContent className="p-5 space-y-5">
									<div>
										<h3 className="font-medium mb-2">Deskripsi</h3>
										<p className="text-sm text-muted-foreground">
											{report.description}
										</p>
									</div>

									<div>
										<h3 className="font-medium mb-2">Kategori</h3>
										<div className="flex items-center">
											<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mr-2">
												<AlertTriangle className="h-4 w-4 text-primary" />
											</div>
											<span>{report.category}</span>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-muted/80 shadow-sm">
								<CardContent className="p-5">
									<h3 className="font-medium mb-3">Lokasi</h3>
									<div className="h-[200px] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
										<MapPin className="h-6 w-6 text-muted-foreground" />
										<span className="text-sm text-muted-foreground ml-2">
											Map location
										</span>
									</div>
								</CardContent>
							</Card>

							<Card className="border-muted/80 shadow-sm">
								<CardContent className="p-5">
									<h3 className="font-medium mb-3">Di tangani oleh</h3>
									<div className="flex items-center">
										<Avatar className="h-10 w-10 mr-3">
											<AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
												PW
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">Public Works Department</p>
											<p className="text-sm text-muted-foreground">
												Responsible for road maintenance
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="updates" className="space-y-4 mt-4">
							<Card className="border-muted/80 shadow-sm">
								<CardContent className="p-5">
									<div className="space-y-6">
										{report.timeline.map((item, index) => (
											<div key={index} className="relative pl-6">
												<div className="absolute left-0 top-0 bottom-0 w-[2px] bg-muted">
													<div
														className="absolute top-0 w-[2px] bg-primary"
														style={{
															height: `${
																((index + 1) / report.timeline.length) * 100
															}%`,
														}}
													/>
												</div>
												<div
													className={`absolute left-[-5px] top-0 w-[12px] h-[12px] rounded-full ${
														index <= report.currentStep
															? "bg-primary shadow-md"
															: "bg-muted"
													}`}
												/>
												<div className="space-y-1 pb-6">
													<div className="flex justify-between">
														<p className="font-medium">{item.title}</p>
														<p className="text-xs text-muted-foreground">
															{item.date}
														</p>
													</div>
													<p className="text-sm text-muted-foreground">
														{item.description}
													</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{report.status === "completed" && (
								<Card className="border-muted/80 shadow-sm">
									<CardContent className="p-5 space-y-3">
										<h3 className="font-medium">Rate Resolution</h3>
										<p className="text-sm text-muted-foreground">
											How satisfied are you with the resolution of this report?
										</p>
										<div className="flex gap-3">
											<Button
												variant={
													feedback === "satisfied" ? "default" : "outline"
												}
												className="flex-1 rounded-full"
												onClick={() => setFeedback("satisfied")}
											>
												<ThumbsUp className="mr-2 h-4 w-4" />
												Satisfied
											</Button>
											<Button
												variant={
													feedback === "unsatisfied" ? "default" : "outline"
												}
												className="flex-1 rounded-full"
												onClick={() => setFeedback("unsatisfied")}
											>
												<ThumbsDown className="mr-2 h-4 w-4" />
												Unsatisfied
											</Button>
										</div>
										{feedback && (
											<Button className="w-full rounded-full mt-2">
												Submit Feedback
											</Button>
										)}
									</CardContent>
								</Card>
							)}
						</TabsContent>

						<TabsContent value="comments" className="space-y-4 mt-4">
							<Card className="border-muted/80 shadow-sm">
								<CardContent className="p-5 space-y-4">
									{report.comments.length > 0 ? (
										<div className="space-y-4">
											{report.comments.map((comment, index) => (
												<div key={index} className="flex gap-3">
													<Avatar className="h-9 w-9">
														<AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
															{comment.user.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1 space-y-1">
														<div className="flex justify-between">
															<p className="font-medium text-sm">
																{comment.user}
															</p>
															<p className="text-xs text-muted-foreground">
																{comment.date}
															</p>
														</div>
														<p className="text-sm">{comment.text}</p>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
											<p className="text-muted-foreground">No comments yet</p>
										</div>
									)}

									<form
										onSubmit={handleCommentSubmit}
										className="pt-4 border-t"
									>
										<div className="space-y-3">
											<Textarea
												placeholder="Add a comment..."
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												className="min-h-[100px] rounded-lg"
											/>
											<Button
												type="submit"
												disabled={!comment.trim()}
												className="rounded-full"
											>
												Post Comment
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
