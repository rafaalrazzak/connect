"use client";

import type React from "react";

import EmptyState from "@/components/admin/empty-state";
import LoadingSpinner from "@/components/admin/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { reports } from "@/lib/mock-data";
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	ChevronLeft,
	Clock,
	FileText,
	Info,
	MapPin,
	MessageSquare,
	Send,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReportDetail({ params }: { params: { id: string } }) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);

	// In a real app, we would fetch the report data from an API
	const report = reports.find((r) => r.id === params.id) || reports[0];

	const [activeTab, setActiveTab] = useState("details");
	const [comment, setComment] = useState("");
	const [status, setStatus] = useState(report.status);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isInternalNote, setIsInternalNote] = useState(false);

	// Simulate data loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			toast({
				title: isInternalNote ? "Internal note added" : "Comment posted",
				description: "Your message has been saved successfully.",
			});
			setComment("");
			setIsInternalNote(false);
			setIsSubmitting(false);
		}, 1000);
	};

	const handleStatusChange = (newStatus: string) => {
		setStatus(newStatus);

		// In a real app, we would update the status via API
		toast({
			title: "Status Updated",
			description: `Report has been marked as ${getStatusLabel(newStatus)}`,
		});
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "waiting":
				return "Pending";
			case "processing":
				return "In Progress";
			case "completed":
				return "Completed";
			case "rejected":
				return "Rejected";
			default:
				return status;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "waiting":
				return (
					<Badge
						variant="outline"
						className="bg-amber-100 text-amber-800 border-amber-200"
					>
						Pending
					</Badge>
				);
			case "processing":
				return (
					<Badge
						variant="outline"
						className="bg-blue-100 text-blue-800 border-blue-200"
					>
						In Progress
					</Badge>
				);
			case "completed":
				return (
					<Badge
						variant="outline"
						className="bg-green-100 text-green-800 border-green-200"
					>
						Completed
					</Badge>
				);
			case "rejected":
				return (
					<Badge
						variant="outline"
						className="bg-red-100 text-red-800 border-red-200"
					>
						Rejected
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-120px)] flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="flex items-center">
					<Link href="/admin/reports">
						<Button variant="ghost" size="icon" className="rounded-full mr-2">
							<ChevronLeft className="h-5 w-5" />
						</Button>
					</Link>
					<h1 className="text-2xl font-bold">Report Details</h1>
				</div>
				<div className="flex-1 flex flex-col sm:flex-row gap-2 sm:justify-end">
					<Select value={status} onValueChange={handleStatusChange}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Update Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="waiting">Pending</SelectItem>
							<SelectItem value="processing">In Progress</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline">Assign</Button>
					<Button>Save Changes</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-xl">{report.title}</CardTitle>
									<CardDescription>Report ID: {report.id}</CardDescription>
								</div>
								{getStatusBadge(status)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-4 text-sm mb-4">
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
								<div className="flex items-center text-muted-foreground">
									<FileText className="w-4 h-4 mr-1" />
									<span>{report.category}</span>
								</div>
							</div>

							<div className="relative mb-6">
								<img
									src={report.imageUrl || "/placeholder.svg"}
									alt={report.title}
									className="w-full h-[300px] object-cover rounded-lg"
								/>
							</div>

							<Tabs
								defaultValue="details"
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="grid grid-cols-3 w-full">
									<TabsTrigger value="details">Details</TabsTrigger>
									<TabsTrigger value="timeline">Timeline</TabsTrigger>
									<TabsTrigger value="comments">Comments</TabsTrigger>
								</TabsList>

								<TabsContent value="details" className="space-y-4 mt-4">
									<div>
										<h3 className="font-medium mb-2">Description</h3>
										<p className="text-muted-foreground">
											{report.description}
										</p>
									</div>

									<Separator />

									<div>
										<h3 className="font-medium mb-2">Location</h3>
										<div className="h-[200px] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
											<MapPin className="h-6 w-6 text-muted-foreground" />
											<span className="text-sm text-muted-foreground ml-2">
												Map location
											</span>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="timeline" className="space-y-4 mt-4">
									<div className="space-y-6">
										{report.timeline.map((item, index) => (
											<div key={index} className="relative pl-6">
												<div className="absolute left-0 top-0 bottom-0 w-[2px] bg-muted">
													<div
														className="absolute top-0 w-[2px] bg-primary"
														style={{
															height: `${((index + 1) / report.timeline.length) * 100}%`,
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

									<div className="mt-4 flex flex-wrap gap-2">
										<Button variant="outline" size="sm">
											<Calendar className="mr-2 h-4 w-4" />
											Schedule Follow-up
										</Button>
										<Button variant="outline" size="sm">
											<Info className="mr-2 h-4 w-4" />
											Request More Info
										</Button>
									</div>
								</TabsContent>

								<TabsContent value="comments" className="space-y-4 mt-4">
									<div className="space-y-4">
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
											<EmptyState
												icon={<MessageSquare className="h-12 w-12" />}
												title="No comments yet"
												description="Be the first to add a comment to this report"
											/>
										)}

										<form
											onSubmit={handleCommentSubmit}
											className="pt-4 border-t"
										>
											<div className="space-y-3">
												<Textarea
													placeholder="Add a comment or note..."
													value={comment}
													onChange={(e) => setComment(e.target.value)}
													className="min-h-[100px] rounded-lg"
												/>
												<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
													<div className="flex items-center">
														<input
															type="checkbox"
															id="internal"
															className="mr-2"
															checked={isInternalNote}
															onChange={(e) =>
																setIsInternalNote(e.target.checked)
															}
														/>
														<label htmlFor="internal" className="text-sm">
															Internal note (not visible to reporter)
														</label>
													</div>
													<Button
														type="submit"
														disabled={!comment.trim() || isSubmitting}
													>
														{isSubmitting ? "Posting..." : "Post Comment"}
														<Send className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</div>
										</form>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Button
								className="w-full justify-start"
								variant="outline"
								onClick={() => handleStatusChange("completed")}
								disabled={status === "completed"}
							>
								<CheckCircle className="mr-2 h-4 w-4" />
								Mark as Completed
							</Button>
							<Button
								className="w-full justify-start"
								variant="outline"
								onClick={() => handleStatusChange("processing")}
								disabled={status === "processing"}
							>
								<AlertTriangle className="mr-2 h-4 w-4" />
								Mark as In Progress
							</Button>
							<Button
								className="w-full justify-start"
								variant="outline"
								onClick={() => handleStatusChange("rejected")}
								disabled={status === "rejected"}
							>
								<XCircle className="mr-2 h-4 w-4" />
								Reject Report
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Assigned Department</CardTitle>
						</CardHeader>
						<CardContent>
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
							<Button className="w-full mt-4" variant="outline">
								Change Assignment
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Reporter Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Name:</span>
									<span className="font-medium">{report.reporter}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Email:</span>
									<span className="font-medium">user@example.com</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Phone:</span>
									<span className="font-medium">+1 (555) 123-4567</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Reports:</span>
									<span className="font-medium">5 total</span>
								</div>
							</div>
							<Button className="w-full mt-4" variant="outline">
								View Profile
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Similar Reports</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert>
								<AlertDescription className="text-sm">
									3 similar reports found in this area in the last 30 days.
								</AlertDescription>
							</Alert>
							<Button className="w-full" variant="outline">
								View Similar Reports
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
