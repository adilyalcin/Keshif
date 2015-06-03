var myData = {
    "data": [
    {
        "tags": {
            "subject": [
                "Information",
                "Visualization",
                "Network"
            ],
            "publication": [
                "EuroVis"
            ],
            "year": [
                "2015"
            ],
            "collaborators": [
                "Kairam",
                "Riche",
                "Fernandez",
                "Heer"
            ]
        },
        "img": "researchImages/refinery.png",
        "caption": "Refinery",
        "primary": "Visualization",
        "reference": "Kairam, S., N.H. Riche, S. Drucker, R. Fernandeaz, J. Heer, Refinery: Visual Exploration of Large, Heterogeneous Networks through Associative Browsing, To Appear Eurographics Conference on Visualization, (EuroVis) 2015.",
        "pdf": "",
        "video": "",
        "pabstract": "Browsing is a fundamental aspect of exploratory information-seeking. Associative browsing encompasses a common and intuitive set of exploratory strategies in which users step iteratively from familiar to novel pieces of information. In this paper, we consider associative browsing as a strategy for bottom-up exploration of large, heterogeneous networks. We present Refinery, an interactive visualization system informed by guidelines drawn from examination of several areas of literature related to exploratory information-seeking. These guidelines motivate Refinery’s query model, which allows users to simply and expressively construct queries using heterogeneous sets of nodes. The system ranks and returns associated content using a fast, random-walk based algorithm, visualizing results and connections among them to provide explanatory context, facilitate serendipitous discovery, and stimulate continued exploration. A study of 12 academic researchers using Refinery to browse publication data related to areas of study demonstrates how the system complements existing tools in supporting discovery. ",
        "id": 0,
        "year": "2015",
        "$$hashKey": "02E",
        "thumb": "thumbnail/refinery.png"
    },
{
    "tags": {
        "subject": [
            "Information",
            "Visualization",
            "Touch",
            "Sequences"
        ],
        "publication": [
            "SIGCHI"
        ],
        "year": [
            "2015"
        ],
        "collaborators": [
            "Amershi",
            "Chickering",
            "Lee",
            "Simard",
            "Suh"
        ]
    },
    "img": "researchImages/modeltracker.png",
    "caption": "Modeltracker",
    "primary": "Machine Learning",
    "reference": "Amershi, S., Chickering, M., Drucker, S., Lee, B., Simard, P., and Suh, J. (2015) ModelTracker: Redesigning Performance Analysis Tools for Machine Learning. Proceedings of the ACM Conference on Human Factors in Computing Systems (CHI 2015).",
    "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/pn2048-amershi-fixed.pdf",
    "video": "",
    "pabstract": "Model building in machine learning is an iterative process. The performance analysis and debugging step typically involves a disruptive cognitive switch from model building to error analysis, discouraging an informed approach to model building. We present ModelTracker, an interactive visualization that subsumes information contained in numerous traditional summary statistics and graphs while displaying example-level performance and enabling direct error examination and debugging. Usage analysis from machine learning practitioners building real models with  ModelTracker over six months shows ModelTracker is used often and throughout model building. A controlled experiment focusing on ModelTracker’s debugging capabilities shows participants prefer ModelTracker over traditional tools without a loss in model performance.",
    "id": 0,
    "year": "2015",
    "$$hashKey": "02C",
    "thumb": "thumbnail/modeltracker.png"
},
{
        "tags": {
            "subject": [
                "Information",
                "Visualization",
                "Touch",
                "Sequences"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2015"
            ],
            "collaborators": [
                "Zgraggen",
                "Fisher",
                "DeLine"
            ]
        },
        "img": "researchImages/squeries.png",
        "caption": "Squeries",
        "primary": "Visualization",
        "reference": "Zgraggen, Emanuel, Steven M. Drucker, Danyel Fisher, Rob DeLine. (s|qu)eries: Visual Regular Expressions for Querying and Exploring Event Sequences. Proceedings of ACM Conference on Human Factors in Computing Systems (CHI 2015).",
        "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/chi2015-squeries.pdf",
        "video": "http://research.microsoft.com/en-us/um/people/sdrucker/video/squeries_v1.0.mp4",
        "pabstract": "Many different domains collect event sequence data and rely on finding and analyzing patterns within it to gain meaningful insights. Current systems that support such queries either provide limited expressiveness, hinder exploratory workflows or present interaction and visualization models which do not scale well to large and multi-faceted data sets. In this paper we present (s|qu)eries (pronounced 'Squeries'), a visual query interface for creating queries on sequences (series) of data, based on regular expressions. (s|qu)eries is a touchbased system that exposes the full expressive power of regular expressions in an approachable way and interleaves query specification with result visualizations. Being able to visually investigate the results of different query-parts supports debugging and encourages iterative query-building as well as exploratory work-flows. We validate our design and implementation through a set of informal interviews with data scientists that analyze event sequences on a daily basis.",
        "id": 0,
        "year": "2015",
        "$$hashKey": "02D",
        "thumb": "thumbnail/squeries.png"
},
{
    "tags": {
        "subject": [
            "Information",
            "Visualization",
            "Touch"
        ],
        "publication": [
            "Infovis"
        ],
        "year": [
            "2014"
        ],
        "collaborators": [
            "Zgraggen",
            "Zeleznik"
        ]
    },
    "img": "researchImages/panodata.png",
    "caption": "Panoramic Data",
    "primary": "Visualization",
    "reference": "Zgraggen, Emanuel, Robert Zeleznik, and Steven M. Drucker. PanoramicData: Data Analysis through Pen & Touch. (2014).",
    "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/PanoramicData.pdf",
    "video": "http://research.microsoft.com/en-us/um/people/sdrucker/video/panodata.mp4.mp4",
    "pabstract": "Interactively exploring multidimensional datasets requires frequent switching among a range of distinct but inter-related tasks (e.g., producing different visuals based on different column sets, calculating new variables, and observing the interactions between sets of data). Existing approaches either target specific different problem domains (e.g., data-transformation or datapresentation) or expose only limited aspects of the general exploratory process; in either case, users are forced to adopt coping strategies (e.g., arranging windows or using undo as a mechanism for comparison instead of using side-by-side displays) to compensate for the lack of an integrated suite of exploratory tools. PanoramicData (PD) addresses these problems by unifying a comprehensive set of tools for visual data exploration into a hybrid pen and touch system designed to exploit the visualization advantages of large interactive displays. PD goes beyond just familiar visualizations by including direct UI support for data transformation and aggregation, filtering and brushing. Leveraging an unbounded whiteboard metaphor, users can combine these tools like building blocks to create detailed interactive visual display networks in which each visualization can act as a filter for others. Further, by operating directly on relational-databases, PD provides an approachable visual language that exposes a broad set of the expressive power of SQL, including functionally complete logic filtering, computation of aggregates and natural table joins. To understand the implications of this novel approach, we conducted a formative user study with both data and visualization experts. The results indicated that the system provided a fluid and natural user experience for probing multi-dimensional data and was able to cover the full range of queries that the users wanted to pose",
    "id": 0,
    "year": "2014",
    "$$hashKey": "02B",
    "thumb": "thumbnail/panodata.png"
},
{
        "tags": {
            "subject": [
                "Information",
                "Visualization",
                "Machine Learning"
            ],
            "publication": [
                "TKDE"
            ],
            "year": [
                "2014"
            ],
            "collaborators": [
                "Liu",
                "Chen",
                "Wei",
                "Yang",
                "Zhou"
            ]
        },
        "img": "researchImages/leadlag.png",
        "caption": "Topic-Lead-Lag",
        "primary": "Visualization",
        "reference": "Liu, S., Chen, Y., Wei, H., Yang, J., Zhou, K., & Drucker, S. M. Exploring Topical Lead-Lag across Corpora. IEEE TKDE",
        "pdf": "http://research.microsoft.com/en-us/um/people/shliu/TextPioneerTKDE.pdf",
        "video": "http://research.microsoft.com/en-us/um/people/shliu/TextPioneerTKDE.pdf",
        "pabstract": "Identifying which text corpus leads in the context of a topic presents a great challenge of considerable interest to researchers. Recent research into lead-lag analysis has mainly focused on estimating the overall leads and lags between two corpora. However, real-world applications have a dire need to understand lead-lag patterns both globally and locally. In this paper, we introduce TextPioneer, an interactive visual analytics tool for investigating lead-lag across corpora from the global level to the local level. In particular, we extend an existing lead-lag analysis approach to derive two-level results. To convey multiple perspectives of the results, we have designed two visualizations, a novel hybrid tree visualization that couples a radial space-filling tree with a node-link diagram and a twisted-ladder-like visualization. We have applied our method to several corpora and the evaluation shows promise, especially in support of text comparison at different levels of detail.",
        "id": 0,
        "year": "2014",
        "$$hashKey": "02A",
        "thumb": "thumbnail/leadlag.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Presentation"
        ],
        "publication": [
            "SIGCHI"
        ],
        "year": [
            "2014"
        ],
        "collaborators": [
            "Chi",
            "Lee"
        ]
    },
    "img": "researchImages/demowiz.png",
    "caption": "Demowiz",
    "primary": "Presentation",
    "reference": "Chi, Pei-Yu, Bongshin Lee, and Steven M. Drucker. DemoWiz: re-performing software demonstrations for a live presentation. Proceedings of the 32nd annual ACM conference on Human factors in computing systems. ACM, 2014.",
    "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/demowiz.pdf",
    "video": "http://research.microsoft.com/en-us/people/sdrucker/video/demowiz.mp4",
    "pabstract": "Showing a live software demonstration during a talk can be engaging, but it is often not easy: presenters may struggle with (or worry about) unexpected software crashes and  encounter issues such as mismatched screen resolutions or faulty network connectivity.  Furthermore, it can be difficult to recall the steps to show while talking and operating the  system all at the same time. An alternative is to present with pre-recorded screencast videos. It is, however, challenging to precisely match the narration to the video when using existing video players. We introduce DemoWiz, a video presentation system that provides an increased awareness of upcoming actions through glanceable visualizations. DemoWiz supports better control of timing by overlaying visual cues and enabling lightweight editing. A user study shows that our design significantly improves the presenters’ perceived ease of narration and timing compared to a system without visualizations that was similar to a standard playback control. Furthermore, nine (out of ten) participants preferred DemoWiz over the standard playback control with the last expressing no preference.",
    "id": 0,
    "year": "2014",
    "$$hashKey": "029",
    "thumb": "thumbnail/demowiz.png"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "Information",
                "Design"
            ],
            "publication": [
                "AVI"
            ],
            "year": [
                "2013"
            ],
            "collaborators": [
                "Bigelow",
                "Fisher",
                "Meyer"
            ]
        },
        "img": "researchImages/DesignReflections.png",
        "caption": "DesignReflections",
        "primary": "Visualization",
        "reference": "Alex Bigelow, Steven Drucker, Danyel Fisher, and Miriah Meyer, Reflections on How Designers Design With Data, in AVI 2014 International Working Conference on Advanced Visual Interfaces, ACM, May 2014",
        "pdf": "http://research.microsoft.com/apps/pubs/default.aspx?id=217732",
        "video": "http://research.microsoft.com/apps/pubs/default.aspx?id=217732",
        "pabstract": "In recent years many popular data visualizations have emerged that are created largely by designers whose main area of expertise is not computer science. Designers generate these visualizations using a handful of design tools and environments. To better inform the development of tools intended for designers working with data, we set out to understand designers' challenges and perspectives. We interviewed professional designers, conducted observations of designers working with data in the lab, and observed designers working with data in team settings in the wild. A set of patterns emerged from these observations from which we extract a number of themes that provide a new perspective on design considerations for visualization tool creators, as well as on known engineering problems.",
        "id": 0,
        "year": "2013",
        "$$hashKey": "028",
        "thumb": "thumbnail/DesignReflections.png"
},
{
    "tags": {
        "subject": [
            "UI"
        ],
        "publication": [
            "Interact"
        ],
        "year": [
            "2013"
        ],
        "collaborators": [
            "Morris",
            "Danielescu",
            "Fisher",
            "Lee",
            "schraefel",
            "Wobbrock"
        ]
    },
    "img": "researchImages/gestureelicitation.png",
    "caption": "GestureElicitation",
    "primary": "UI-Information",
    "reference": "Meredith Ringel Morris, Andreea Danielescu, Steven Drucker, Danyel Fisher, Bongshin Lee, m.c. schraefel, and Jacob O. Wobbrock, Reducing Legacy Bias in Gesture Elicitation Studies, in ACM Interactions Magazine, ACM, May 2014",
    "pdf": "http://research.microsoft.com/apps/pubs/default.aspx?id=208568",
    "video": "http://research.microsoft.com/apps/pubs/default.aspx?id=208568",
    "pabstract": "Improving methods for choosing appropriate gestures for novel user interaction techniques.",
    "id": 0,
    "year": "2013",
    "$$hashKey": "027",
    "thumb": "thumbnail/gestureelicitation.png"
},
{
        "tags": {
            "subject": [
                "Visualization"
            ],
            "publication": [
                "CGA"
            ],
            "year": [
                "2013"
            ],
            "collaborators": [
                "Fisher",
                "Konig"
            ]
        },
        "img": "researchImages/incrvis.png",
        "caption": "IncrementalVis",
        "primary": "Visualization",
        "reference": "Danyel Fisher, Steven M. Drucker, and A. Christian König, Exploratory Visualization Involving Incremental, Approximate Database Queries and Uncertainty, in IEEE Computer Graphics and Applications, IEEE, July 2012",
        "pdf": "http://research.microsoft.com/apps/pubs/default.aspx?id=208568",
        "video": "http://research.microsoft.com/apps/pubs/default.aspx?id=208568",
        "pabstract": "Large datasets can mean slow queries, for which users must wait. Incremental visualization systems can give faster results at a cost of accuracy. This article asked analysts to use one and report on their results. Their feedback provides suggestions for alternative visualizations to represent a query still in progress.",
        "id": 0,
        "year": "2013",
        "$$hashKey": "026",
        "thumb": "thumbnail/incrvis.png"
},
{
    "tags": {
        "subject": [
            "Information"
        ],
        "publication": [
            "Sigmod"
        ],
        "year": [
            "2013"
        ],
        "collaborators": [
            "Barnett",
            "Chandramouli",
            "DeLine",
            "Fisher",
            "Goldstein",
            "Morrison",
            "Platt"
        ]
    },
    "img": "researchImages/stat.png",
    "caption": "Stat!",
    "primary": "UI-Information",
    "reference": "Mike Barnett, Badrish Chandramouli, Robert DeLine, Steven Drucker, Danyel Fisher, Jonathan Goldstein, Patrick Morrison, and John Platt, Stat! - An Interactive Analytics Environment for Big Data, in ACM SIGMOD International Conference on Management of Data (SIGMOD 2013), ACM SIGMOD, June 2013",
    "pdf": "http://research.microsoft.com/pubs/194060/stat-sigmod2013-demo.pdf",
    "video": "http://research.microsoft.com/pubs/194060/stat-sigmod2013-demo.pdf",
    "pabstract": "Exploratory analysis on big data requires us to rethink data management across the entire stack – from the underlying data processing techniques to the user experience. We demonstrate Stat! – a visualization and analytics environment that allows users to rapidly experiment with exploratory queries over big data. Data scientists can use Stat! to quickly refine to the correct query, while getting immediate feedback after processing a fraction of the data. Stat! can work with multiple processing engines in the backend; in this demo, we use Stat! with the Microsoft StreamInsight streaming engine. StreamInsight is used to generate incremental early results to queries and refine these results as more data is processed. Stat! allows data scientists to explore data, dynamically compose multiple queries to generate streams of partial results, and display partial results in both textual and visual form",
    "id": 0,
    "year": "2013",
    "$$hashKey": "025",
    "thumb": "thumbnail/stat.png"
},
{
        "tags": {
            "subject": [
                "Information",
                "Visualization",
                "Presentation"
            ],
            "publication": [
                "Infovis"
            ],
            "year": [
                "2013"
            ],
            "collaborators": [
                "Hullman",
                "Riche",
                "Fisher",
                "Adar",
                "Lee"
            ]
        },
        "img": "researchImages/narratives.png",
        "caption": "Narrative",
        "primary": "Visualization",
        "reference": "Hullman, J., Drucker, S., Henry Riche, N., Lee, B., Fisher, D., & Adar, E. (2013). A deeper understanding of sequence in narrative visualization. Visualization and Computer Graphics, IEEE Transactions on, 19(12), 2406-2415.",
        "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/narrative.pdf",
        "video": "http://research.microsoft.com/en-us/people/sdrucker/papers/",
        "pabstract": "         Conveying a narrative with visualizations often requires choosing an order in which to present visualizations. While evidence exists that narrative sequencing in traditional stories can affect comprehension and memory, little is known about how sequencing choices affect narrative visualization. We consider the forms and reactions to sequencing in narrative visualization presentations to provide a deeper understanding with a focus on linear, slideshow-style presentations. We conduct a qualitative analysis of 42 professional narrative visualizations to gain empirical knowledge on the forms that structure and sequence take. Based on the results of this study we propose a graph-driven approach for automatically identifying effective sequences in a set of visualizations to be presented linearly. Our approach identifies possible transitions in a visualization set and prioritizes local (visualization-to-visualization) transitions based on an objective function that minimizes the cost of transitions from the audience perspective. We conduct two studies to validate this function. We also expand the approach with additional knowledge of user preferences for different types of local transitions and the effects of global sequencing strategies on memory, preference, and comprehension. Our results include a relative ranking of types of visualization transitions by the audience perspective and support or memory and subjective rating benefits of visualization sequences that use parallelism as a structural device. We discuss how these insights can guide the design of narrative visualization and systems that support optimization of visualization sequence.",
        "id": 0,
        "year": "2013",
        "$$hashKey": "024",
        "thumb": "thumbnail/narratives.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Information",
            "Visualization",
            "Touch"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2013"
        ],
        "collaborators": [
            "Fernandez",
            "Fisher"
        ]
    },
    "img": "researchImages/sanddance.png",
    "caption": "SandDance",
    "primary": "Visualization",
    "reference": "Unpublished",
    "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/SandDance/",
    "video": "http://research.microsoft.com/apps/video/default.aspx?id=188294",
    "pabstract": "SandDance is a browser based information visualization system prototype created at Microsoft Research that scales to hundreds of thousands of items. Arbitrary datatables can be loaded and results can be filtered using facets and search and displayed in a variety of layouts. Transitions between the views are animated so that users can better maintain context. Multiple linked views allow for associations between the same items in each view. Multiple devices can simultaneusly interact with each other on the same dataset.  Using principles of information visualization, users can map any attribute into the position, color, size, opacity and layout of a dataset to help reveal patterns within the data. SandDance lets you see both the individual records, and their overall structure.  SandDance focusses on natural user interaction techniques. Touch interaction is a first class citizen, allowing the entire experience to be easily operated through a touch screen. The system also understand speech commands for searching, selecting, focusing and filtering the data. A kinect system can be used to sense gestures for moving between views of the data. Collaboration is supported by allowing multiple sets of people to interact with the same dataset. Selections and filters in one system are automatically replicated to other systems viewing the data. ",
    "id": 0,
    "year": "2013",
    "$$hashKey": "023",
    "thumb": "thumbnail/sanddance.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Touch"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2013"
            ],
            "collaborators": [
                "Fisher",
                "Sadana",
                "Herron",
                "schraefel"
            ]
        },
        "img": "researchImages/touchvis.png",
        "caption": "TouchViz",
        "primary": "Visualization",
        "reference": "Steven M. Drucker, Danyel Fisher, Ramik Sadana, Jessica Herron, and mc schraefel, TouchViz, A Case Study Comparing Tow Interfaces for Data Analytics on Tablets, in Proceedings of the 2012 Conference on Human Factors in Computing Systems (CHI 2013), ACM Conference on Human Factors in Computing Systems, 29 April 2013",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/touchvis-CHI2013-cameraready.pdf",
        "video": "http://research.microsoft.com/~sdrucker/video/TouchViz2.mp4",
        "pabstract": "As more applications move from the desktop to touch devices like tablets, designers must wrestle with the costs of porting a design with as little revision of the UI as possible from one device to the other, or of optimizing the interaction per device. We consider the tradeoffs between two versions of a UI for working with data on a touch tablet. One interface is based on using the conventional desktop metaphor (WIMP) with a control panel, push buttons, and checkboxes where the mouse click is effectively replaced by a finger tap. The other interface (which we call FLUID) eliminates the control panel and focuses touch actions on the data visualization itself. We describe our design process and evaluation of each interface. We discuss the significantly better task performance and preference for the FLUID interface, in particular how touch design may challenge certain assumptions about the performance benefits of WIMP interfaces that do not hold on touch devices, such as the superiority of gestural vs. control panel based interaction.",
        "id": 0,
        "year": "2013",
        "$$hashKey": "022",
        "thumb": "thumbnail/touchvis.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Graphics",
            "Photos"
        ],
        "publication": [
            "UIST"
        ],
        "year": [
            "2012"
        ],
        "collaborators": [
            "Joshi",
            "Metha",
            "Stollnitz",
            "Cohen",
            "Hoppe",
            "Uyttendaele"
        ]
    },
    "img": "researchImages/cliplets.png",
    "caption": "Cliplets",
    "primary": "Photos",
    "reference": "Joshi, N., Metha, S., Drucker, S., Stollnitz, E., Hoppe, H., Uyttendaele, M., and Cohen, M. Cliplets: Juxtaposing Still and Dynamic Imagery. ACM UIST 2012.",
    "pdf": "http://research.microsoft.com/en-us/um/redmond/projects/cliplets/index.aspx",
    "video": "http://www.youtube.com/watch?feature=player_embedded&v=3BmO3TILucQ",
    "pabstract": "We explore creating cliplets, a form of visual media that juxtaposes still image and video segments, both spatially and temporally, to expressively abstract a moment. Much as in cinemagraphs, the tension between static and dynamic elements in a cliplet reinforces both aspects, strongly focusing the viewer's attention. Creating this type of imagery is challenging without professional tools and training. We develop a set of idioms, essentially spatiotemporal mappings, that characterize cliplet elements, and use these idioms in an interactive system to quickly compose a cliplet from ordinary handheld video. One difficulty is to avoid artifacts in the cliplet composition without resorting to extensive manual input. We address this with automatic alignment, looping optimization and feathering, simultaneous matting and compositing, and Laplacian blending. A key user-interface challenge is to provide affordances to define the parameters of the mappings from input time to output time while maintaining a focus on the cliplet being created. We demonstrate the creation of a variety of cliplet types. We also report on informal feedback as well as a more structured survey of users.",
    "id": 0,
    "year": "2012",
    "$$hashKey": "021",
    "thumb": "thumbnail/cliplets.png"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Photos"
            ],
            "publication": [
                "SIGGRAPHAsia"
            ],
            "year": [
                "2012"
            ],
            "collaborators": [
                "Kopf",
                "Kienzle",
                "Kang"
            ]
        },
        "img": "researchImages/completion.png",
        "caption": "Completion",
        "primary": "Photos",
        "reference": "Johannes Kopf, Wolf Kienzle, Steven Drucker, Sing Bing Kang, Quality Prediction for Image Completion, ACM Transactions on Graphics (Proceedings of SIGGRAPH Asia 2012), 31(6), Article no. 196, 2012",
        "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/completion.pdf",
        "video": "",
        "pabstract": "We present a data-driven method to predict the performance of an image completion method. Our image completion method is based on the state-of-the-art non-parametric framework of Wexler et al. [2007]. It uses automatically derived search space constraints for patch source regions, which lead to improved texture synthesis and semantically more plausible results. These constraints also facilitate performance prediction by allowing us to correlate output quality against features of possible regions used for synthesis. We use our algorithm to first crop and then complete stitched panoramas. Our predictive ability is used to find an optimal crop shape before the completion is computed, potentially saving significant amounts of computation. Our optimized crop includes as much of the original panorama as possible while avoiding regions that can be less successfully filled in. Our predictor can also be applied for hole filling in the interior of images. In addition to extensive comparative results, we ran several user studies validating our predictive feature, good relative quality of our results against those of other state-of-the-art algorithms, and our automatic cropping algorithm.",
        "id": 0,
        "year": "2012",
        "$$hashKey": "020",
        "thumb": "thumbnail/completion.png"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Photos"
        ],
        "publication": [
            "SIGGRAPHAsia"
        ],
        "year": [
            "2012"
        ],
        "collaborators": [
            "Guenter",
            "Finch",
            "Tan",
            "Snyder"
        ]
    },
    "img": "researchImages/foveated.png",
    "caption": "Foveated",
    "primary": "Graphics",
    "reference": "Foveated 3D Graphics, Brian Guenter, Mark Finch, Steven Drucker, Desney Tan, John Snyder ACM SIGGRAPH Asia 2012.",
    "pdf": "http://research.microsoft.com/apps/pubs/default.aspx?id=176610",
    "video": "http://research.microsoft.com/apps/video/default.aspx?id=173013",
    "pabstract": "We present a data-driven method to predict the performance of an image completion method. Our image completion method is based on the state-of-the-art non-parametric framework of Wexler et al. [2007]. It uses automatically derived search space constraints for patch source regions, which lead to improved texture synthesis and semantically more plausible results. These constraints also facilitate performance prediction by allowing us to correlate output quality against features of possible regions used for synthesis. We use our algorithm to first crop and then complete stitched panoramas. Our predictive ability is used to find an optimal crop shape before the completion is computed, potentially saving significant amounts of computation. Our optimized crop includes as much of the original panorama as possible while avoiding regions that can be less successfully filled in. Our predictor can also be applied for hole filling in the interior of images. In addition to extensive comparative results, we ran several user studies validating our predictive feature, good relative quality of our results against those of other state-of-the-art algorithms, and our automatic cropping algorithm.",
    "id": 0,
    "year": "2012",
    "$$hashKey": "01Z",
    "thumb": "thumbnail/foveated.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Big Data"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2012"
            ],
            "collaborators": [
                "Fisher",
                "Popov",
                "schraefel"
            ]
        },
        "img": "researchImages/incvis.png",
        "caption": "Incremental Visualization",
        "primary": "Visualization",
        "reference": "Danyel Fisher, Igor Popov, Steven M. Drucker, and mc schraefel, Trust Me, I'm Partially Right: Incremental Visualization Lets Analysts Explore Large Datasets Faster, in Proceedings of the 2012 Conference on Human Factors in Computing Systems (CHI 2012), ACM Conference on Human Factors in Computing Systems, 5 May 2012",
        "pdf": "http://research.microsoft.com/pubs/163220/chi2012_interactive.pdf",
        "video": "",
        "pabstract": "Queries over large scale (petabyte) data bases often mean waiting overnight for a result to come back. Scale costs  time. Such time also means that potential avenues of  exploration are ignored because the costs are perceived to  be too high to run or even propose them. With  sampleAction we have explored whether interaction  techniques to present query results running over only  incremental samples can be presented as sufficiently  trustworthy for analysts both to make closer to real time  decisions about their queries and to be more exploratory in  their questions of the data. Our work with three teams of  analysts suggests that we can indeed accelerate and open up  the query process with such incremental visualizations.",
        "id": 0,
        "year": "2012",
        "$$hashKey": "01Y",
        "thumb": "thumbnail/incvis.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Information",
            "Visualization",
            "Temporal"
        ],
        "publication": [
            "AVI"
        ],
        "year": [
            "2012"
        ],
        "collaborators": [
            "Zhao",
            "Fisher",
            "Brinkman"
        ]
    },
    "img": "researchImages/timeslice.png",
    "caption": "TimeSlice",
    "primary": "Visualization",
    "reference": "Jian Zhao, Steven Drucker, Danyel Fisher, Donald Brinkman. TimeSlice: Interactive Faceted Browsing of Timeline Data. In AVI'12: Proceedings of the International Working Conference on Advanced Visual Interfaces, pp. 433-436, May 2012.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/timeslice.pdf",
    "video": "http://research.microsoft.com/~sdrucker/video/timeslicehd.m4v",
    "pabstract": "Temporal events with multiple sets of metadata attributes, i.e., facets, are ubiquitous across different domains. The capabilities of efficiently viewing and comparing events data from various perspectives are critical for revealing relationships, making hypotheses, and discovering patterns. In this paper, we present TimeSlice, an interactive faceted visualization of temporal events, which allows users to easily compare and explore timelines with different attributes on a set of facets. By directly manipulating the filtering tree, a dynamic visual representation of queries and filters in the facet space, users can simultaneously browse the focused timelines and their contexts at different levels of detail, which supports efficient navigation of multi-dimensional events data. Also presented is an initial evaluation of TimeSlice with two datasets - famous deceased people and US daily flight delays.",
    "id": 0,
    "year": "2012",
    "$$hashKey": "01X",
    "thumb": "thumbnail/timeslice.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Big Data"
            ],
            "publication": [
                "Interactions"
            ],
            "year": [
                "2012"
            ],
            "collaborators": [
                "Fisher",
                "DeLine",
                "Czerwinski"
            ]
        },
        "img": "researchImages/bigdata.png",
        "caption": "Big Data Interaction",
        "primary": "Visualization",
        "reference": "Danyel Fisher, Rob DeLine, Mary Czerwinski, and Steven Drucker, Interactions with Big Data Analytics, in ACM Interactions, ACM, May 2012",
        "pdf": "http://research.microsoft.com/apps/pubs/default.aspx?id=163593",
        "video": "",
        "pabstract": "Increasingly in the 21st century,  our daily lives leave behind a  detailed digital record: our shifting  thoughts and opinions shared on  Twitter, our social relationships, our purchasing habits, our information seeking, our photos and videos - even the movements of our bodies and cars",
        "id": 0,
        "year": "2012",
        "$$hashKey": "01W",
        "thumb": "thumbnail/bigdata.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Visualization",
            "Machine Learning"
        ],
        "publication": [
            "IJCAI"
        ],
        "year": [
            "2011"
        ],
        "collaborators": [
            "Patel",
            "Kapoor",
            "Fogarty",
            "Ko",
            "Tan"
        ]
    },
    "img": "researchImages/prospect.png",
    "caption": "Prospect",
    "primary": "Machine Learning",
    "reference": "Patel, K, S.M.Drucker, J. Fogarty, A. Kapoor, D.S.Tan, Prospect: Using Multiple Models to Understand Data, Proceedings of the International Joint Conference on Artificial Intelligence (IJCAI 2011)",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/ijcai11.pdf",
    "video": "http://www.youtube.com/watch?v=9XC-D2L93jA&feature=player_embedded",
    "pabstract": "A human's ability to diagnose errors, gather data, and generate features in order to build better models is largely untapped. We hypothesize that analyzing results from multiple models can help people diagnose errors by understanding relationships among data, features, and algorithms. These relationships might otherwise be masked by the bias inherent to any individual model. We demonstrate this approach in our Prospect system, show how multiple models can be used to detect label noise and aid in generating new features, and validate our methods in a pair of experiments. ",
    "id": 0,
    "year": "2011",
    "$$hashKey": "01V",
    "thumb": "thumbnail/prospect.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Design"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2011"
            ],
            "collaborators": [
                "Fisher",
                "Fernandez",
                "Chen"
            ]
        },
        "img": "researchImages/visavis.png",
        "caption": "Vis-a-vis",
        "primary": "Visualization",
        "reference": "Danyel Fisher, Steven Drucker, Roland Fernandez, and Xiaoji Chen, Vis-a-vis: A Visual Language for Spreadsheet Visualizations, no. MSR-TR-2011-142, June 2011",
        "pdf": "http://research.microsoft.com/apps/pubs/default.aspx?id=159225",
        "video": "http://research.microsoft.com/~sdrucker/video/visavis.wmv",
        "pabstract": "Finding ways for information workers to easily create and modify visualizations that display their own data has been a long time goal within the visualization community. We describe Vis-a-vis, a declarative language for defining and extending visualizations directly within spreadsheets. Vis-a-vis allows users to directly bind data and formula to the visual attributes of an extensible set of visualization primitives. The visualizations that Vis-a-vis creates can be shared and modified easily, allowing users to modify existing visualizations. This approach allows users to select visualizations from a gallery, to customize them easily, or to create novel visualizations. The approach leverages familiar formulas and data from spreadsheets. We prototype a system that uses this language, and use it to build a number of standard and custom visualizations, and gather formative feedback from a small user study.",
        "id": 0,
        "year": "2011",
        "$$hashKey": "01U",
        "thumb": "thumbnail/visavis.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Visualization",
            "Machine Learning"
        ],
        "publication": [
            "Interact"
        ],
        "year": [
            "2011"
        ],
        "collaborators": [
            "Fisher",
            "Basu"
        ]
    },
    "img": "researchImages/iclustering1.png",
    "caption": "iCluster",
    "primary": "Visualization",
    "reference": "Steven M. Drucker, Danyel Fisher, and Sumit Basu, Helping Users Sort Faster with Adaptive Machine Learning Recommendations, in Proceedings of Interact 2011, Springer, September 2011",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/icluster_nonanonymous_sdrucker_cameraready.pdf",
    "video": "http://research.microsoft.com/~sdrucker/video/icluster_INTERACT11.mov",
    "pabstract": "Sorting and clustering large numbers of documents can be an overwhelming task: manual solutions tend to be slow, while machine learning systems often present results that don‘t align well with users' intents. We created and evaluated a system for helping users sort large numbers of documents into clusters. iCluster has the capability to recommend new items for existing clusters and appropriate clusters for items. The recommendations are based on a learning model that adapts over time – as the user adds more items to a cluster, the system‘s model improves and the recommendations become more relevant. Thirty-two subjects used iCluster to sort hundreds of data items both with and without recommendations; we found that recommendations allow users to sort items more rapidly. A pool of 161 raters then assessed the quality of the resulting clusters, finding that clusters generated with recommendations were of statistically indistinguishable quality. Both the manual and assisted methods were substantially better than a fully automatic method.",
    "id": 0,
    "year": "2011",
    "$$hashKey": "01T",
    "thumb": "thumbnail/iclustering1.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Visualization"
            ],
            "publication": [
                "Infovis"
            ],
            "year": [
                "2010"
            ],
            "collaborators": [
                "Fisher",
                "Fernandez",
                "Ruble"
            ]
        },
        "img": "researchImages/webcharts.png",
        "caption": "WebCharts",
        "primary": "Visualization",
        "reference": "Danyel Fisher, Steven Drucker, Roland Fernandez, and Scott Ruble, Visualizations Everywhere: A Multiplatform Infrastructure for Linked Visualizations, in Transactions on Visualization and Computer Graphics, IEEE, Salt Lake City, UT, November 2010",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/webcharts.pdf",
        "video": "",
        "pabstract": "In order to use new visualizations, most toolkits require application developers to rebuild their applications and distribute new versions to users. The WebCharts Framework take a different approach by hosting Javascript from within an application and providing a standard data and events interchange.. In this way, applications can be extended dynamically, with a wide variety of visualizations. We discuss the benefits of this architectural approach, contrast it to existing techniques, and give a variety of examples and extensions of the basic system.",
        "id": 0,
        "year": "2010",
        "$$hashKey": "01R",
        "thumb": "thumbnail/webcharts.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Machine Learning"
        ],
        "publication": [
            "AAAI"
        ],
        "year": [
            "2010"
        ],
        "collaborators": [
            "Fisher",
            "Basu",
            "Lu"
        ]
    },
    "img": "researchImages/iclustering2.png",
    "caption": "iClusterTheory",
    "primary": "Machine Learning",
    "reference": "Sumit Basu, Danyel Fisher, Steven M. Drucker, and Hao Lu, Assisting Users with Clustering Tasks by Combining Metric Learning and Classification, in Proceedings of the Twenty-Fourth Conference on Artificial Intelligence (AAAI 2010), American Association for Artificial Intelligence , July 2010",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/iclustering-aaai-2010.pdf",
    "video": "http://research.microsoft.com/~sdrucker/video/icluster_INTERACT11.mov",
    "pabstract": "Interactive clustering refers to situations in which a human labeler is willing to assist a learning algorithm in automatically clustering items. We present a related but somewhat different task, assisted clustering, in which a user creates explicit groups of items from a large set and wants suggestions on what items to add to each group. While the traditional approach to interactive clustering has been to use metric learning to induce a distance metric, our situation seems equally amenable to classification. Using clusterings of documents from human subjects, we found that one or the other method proved to be superior for a given cluster, but not uniformly so. We thus developed a hybrid mechanism for combining the metric learner and the classifier. We present results from a large number of trials based on human clusterings, in which we show that our combination scheme matches and often exceeds the performance of a method which exclusively uses either type of learner.",
    "id": 0,
    "year": "2010",
    "$$hashKey": "01Q",
    "thumb": "thumbnail/iclustering2.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Machine Learning",
                "Programming"
            ],
            "publication": [
                "UIST"
            ],
            "year": [
                "2010"
            ],
            "collaborators": [
                "Patel",
                "Bancroft",
                "Fogarty",
                "Ko",
                "Landay"
            ]
        },
        "img": "researchImages/gestalt.png",
        "caption": "Gestalt",
        "primary": "Machine Learning",
        "reference": "Patel, K, N. Bancroft, S.M.Drucker, J. Fogarty, A. Ko, J.Landay, Gestalt: Integrated Support for Implementation and Analysis in Machine Learning",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/uist2010gestalt.pdf",
        "video": "",
        "pabstract": "We present Gestalt, a development environment designed tosupport the process of applying machine learning. While traditional programming environments focus on source code, we explicitly support both code and data. Gestalt allows developers to implement a classification pipeline, analyze data as it moves through that pipeline, and easily transition between implementation and analysis. An experiment shows this significantly improves the ability of developers to find and fix bugs in machine learning systems. Our discussion of Gestalt and our experimental observations provide new insight into general-purpose support for the  achine learning process.",
        "id": 0,
        "year": "2010",
        "$$hashKey": "01S",
        "thumb": "thumbnail/gestalt.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Information",
            "Visualization",
            "Design",
            "Search"
        ],
        "publication": [
            "SIGCHI"
        ],
        "year": [
            "2009"
        ],
        "collaborators": [
            "Teevan",
            "Cutrell",
            "Fisher",
            "Ramos",
            "Andre",
            "Hu"
        ]
    },
    "img": "researchImages/thumbnail_visualsnippets.png",
    "caption": "Visual Snippets",
    "primary": "Visualization",
    "reference": "Teevan, J. Cutrell, E., Fisher, D., Drucker, S.M., Ramos, G., Andre, P., Hu, C., Visual Snippets: Summarizing Web Pages for Search and Revisitation",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/2008CHI_VisualSnippets.pdf",
    "video": "",
    "pabstract": "People regularly interact with different representations of Web pages. A person looking for new information may initially find a Web page represented as a short snippet rendered by a search engine. When he wants to return to the same page the next day, the page may instead be represented by a link in his browser history. Previous research has explored how to best represent Web pages in support of specific task types, but, as we find in this paper, consistency in representation across tasks is also important. We explore how different representations are used in a variety of contexts and present a compact representation that supports both the identification of new, relevant Web pages and the re-finding of previously viewed pages.",
    "id": 0,
    "year": "2009",
    "$$hashKey": "01O",
    "thumb": "thumbnail/thumbnail_visualsnippets.png"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Search"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2009"
            ],
            "collaborators": [
                "Dontcheva",
                "Medynskiy"
            ]
        },
        "img": "researchImages/thumbnail_contextualfacets.png",
        "caption": "Contextual Facets",
        "primary": "UI-Information",
        "reference": "Medynskiy, Y., Dontcheva, M. Drucker, S.M., Exploring Websites through Contextual Facets, SIGCHI 2009.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/2008CHI_Contextual_Facets.pdf",
        "video": "http://research.microsoft.com/~sdrucker/video/facetPatchCameraReady.mov",
        "pabstract": "We present contextual facets, a novel user interface technique for navigating websites that publish large collections of semi-structured data. Contextual facets extend traditional faceted navigation techniques by transforming webpage elements into user interface components for filtering and retrieving related webpages. To investigate users' reactions to contextual facets, we built FacetPatch, a web browser that automatically generates contextual facet interfaces. As the user browses the web, FacetPatch automatically extracts semi-structured data from collections of webpages and overlays contextual facets on top of the current page. Participants in an exploratory user evaluation of FacetPatch were enthusiastic about contextual facets and often preferred them to an existing, familiar faceted navigation interface. We discuss how we improved the design of contextual facets and FacetPatch based on the results of this study.",
        "id": 0,
        "year": "2009",
        "$$hashKey": "01N",
        "thumb": "thumbnail/thumbnail_contextualfacets.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Information",
            "Web"
        ],
        "publication": [
            "SIGCHI"
        ],
        "year": [
            "2009"
        ],
        "collaborators": [
            "Toomim",
            "Dontcheva",
            "Rahimi",
            "Thomson",
            "Landay"
        ]
    },
    "img": "researchImages/thumbnail_reform.jpg",
    "caption": "reForm",
    "primary": "UI-Information",
    "reference": "Toomim, M., Drucker, S.M., Dontcheva, M., Rahimi, A., Thomson, B., Landay, J.A., Attaching UI Enhancements to Websites with End Users, SIGCHI 2009.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/2008CHI_reform.pdf",
    "video": "",
    "pabstract": "There are not enough programmers to support all end user goals by building websites, mashups, and browser extensions. This paper presents reform, a system that envisions roles for both programmers and end-users in creating enhancements of existing websites that support new goals. Programmers author a traditional mashup or browser extension, but instead of writing a web scraper by hand, the reform system enables novice end users to attach the mashup to their websites of interest. reform both makes scraping easier for the programmer and carries the benefit that endusers can retarget the enhancements towards completely different web sites, using a new programming by example interface and machine learning algorithm for web data extraction. This work presents reform's architecture, algorithms, user interface, evaluation, and five example reform enabled enhancements that provide a step towards our goal of write-once apply-anywhere user interface enhancements.",
    "id": 0,
    "year": "2009",
    "$$hashKey": "01M",
    "thumb": "thumbnail/thumbnail_reform.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Web"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2009"
            ],
            "collaborators": [
                "Flake",
                "Brewer"
            ]
        },
        "img": "researchImages/pivot.png",
        "caption": "LiveLabs Pivot Viewer",
        "primary": "Visualization",
        "reference": "http://research.microsoft.com/en-us/downloads/dd4a479f-92d6-496f-867d-666c87fbaada/default.aspx",
        "pdf": "",
        "video": "http://research.microsoft.com/~sdrucker/video/ThumbtackFinal/ThumbtackIntroductionVideo.wmv",
        "pabstract": "Pivot is an experimental application for exploring large data sets with smooth visual interactions. The application originally was released by Microsoft Live Labs in October 2009, and it is being re-released by Microsoft Research to enable the research community to continue to use it for experiments. If you have Internet Explorer 9 installed, disable GPU rendering in Internet Explorer to enable Pivot to work correctly. The Pivot collection home page points to content no longer available, but Pivot still can be used for viewing user-created local or web collections. This standalone version of Pivot is unsupported and might stop functioning properly in the future.",
        "id": 0,
        "year": "2009",
        "$$hashKey": "01L",
        "thumb": "thumbnail/pivot.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Information",
            "Web"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2009"
        ],
        "collaborators": [
            "Hydrie",
            "Cutler",
            "Oliveira",
            "Bergeron",
            "Lakshmiratan"
        ]
    },
    "img": "researchImages/thumbtackthumb.jpg",
    "caption": "LiveLabs Thumbtack",
    "primary": "UI-Information",
    "reference": "Internal Report",
    "pdf": "",
    "video": "http://research.microsoft.com/~sdrucker/video/ThumbtackFinal/ThumbtackIntroductionVideo.wmv",
    "pabstract": "Thumbtack is an easy way to save links, photos, and anything else you can find on bunch of different Web sites to a single place.  Grab the stuff you want, put it into a Thumbtack collection, then get to it from anywhere you can get online.  Share it with your friends, or just keep it for yourself. It's way easier than sending a bunch of links in an e-mail, and even easier than setting lots of favorites in your browser.",
    "id": 0,
    "year": "2009",
    "$$hashKey": "01P",
    "thumb": "thumbnail/thumbtackthumb.jpg"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "UI",
                "Photos"
            ],
            "publication": [
                "UIST"
            ],
            "year": [
                "2008"
            ],
            "collaborators": [
                "Cohen",
                "Luan",
                "Kopf",
                "Xu"
            ]
        },
        "img": "researchImages/annotategigapixel.jpg",
        "caption": "Annotation Gigapixel Images",
        "primary": "Photos",
        "reference": "Luan, Q, Drucker, S.M., Kopf, J., Xu, Y, Cohen, M.F. Annotating Gigapixel Images, UIST 2008",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/uist2008annotating.pdf",
        "video": "http://research.microsoft.com/~sdrucker/papers/uist2008annotating.pdf",
        "pabstract": "Panning and zooming interfaces for exploring very large images containing billions of pixels (gigapixel images) have recently appeared on the internet. This paper addresses issues that arise when creating and rendering auditory and textual annotations for such images. In particular, we define a distance metric between each annotation and any view resulting from panning and zooming on the image. The distance then informs the rendering of audio annotations and text labels. We demonstrate the annotation system on a number of panoramic images.",
        "id": 0,
        "year": "2008",
        "$$hashKey": "01J",
        "thumb": "thumbnail/annotategigapixel.jpg"
},
{
    "tags": {
        "subject": [
            "UI",
            "Photos"
        ],
        "publication": [
            "HCI"
        ],
        "year": [
            "2008"
        ],
        "collaborators": [
            "Elgart",
            "Kamppari",
            "Lewis",
            "Prasad",
            "Rhee",
            "Satpathy"
        ]
    },
    "img": "researchImages/pixAura.jpg",
    "caption": "Pixaura",
    "primary": "Photos",
    "reference": "Elgart, Kamppari, Lewis, Prasad, Rhee, Satpathy, Drucker, Pixaura: Supporting Tentative Decision Making when Selecting and Sharing Digital Photos, HCI 2008",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/HCI_2008_TentativeDecisionsPixaurafinal.pdf",
    "video": "http://research.microsoft.com/~sdrucker/video/Pixaura_CHI_08_v3.mov",
    "pabstract": "Current advances in digital technology promote capturing and storing more digital photos than ever. While photo collections are growing in size, the amount of time that can be devoted to viewing, managing, and sharing digital photos remains constant. Photo decision-making and selection has been identified as key to addressing this concern. After conducting exploratory research on photo decision-making including a wide-scale survey of user behaviors, detailed contextual inquiries, and longer-term diary studies, Pixaura was designed to address problems that emerged from our research. Specifically, Pixaura aims to bridge the gap between importing source photos and sharing them with others, by supporting tentative decision-making within the selection process. For this experience, the system incorporates certain core elements: 1) flexibility to experiment with relationships between photos and groups of photos, 2) the ability to closely couple photos while sharing only a subset of those photos, and 3) a tight connection between the photo selection and photo sharing space.",
    "id": 0,
    "year": "2008",
    "$$hashKey": "01K",
    "thumb": "thumbnail/pixAura.jpg"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "UI",
                "Search"
            ],
            "publication": [
                "UIST"
            ],
            "year": [
                "2007"
            ],
            "collaborators": [
                "Dontcheva",
                "Cohen",
                "Salesin"
            ]
        },
        "img": "researchImages/relations.png",
        "caption": "Relations, Templates",
        "primary": "UI-Information",
        "reference": "Dontcheva, M, Drucker, S.M., Cohen, M., Salesin, D. Relations, Cards, and Search Templates: User-guided Web Data Integration and Layout, To Appear in UIST, 2007",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/DontchevaUist07.pdf",
        "video": "http://research.microsoft.com/~sdrucker/Video/DontchevaUist07.mov",
        "pabstract": "in collecting and organizing Web content. First, we demonstrate an interface for creating associations between websites, which facilitate the automatic retrieval of related content. Second, we present an authoring interface that allows users to quickly merge content from many different websites into a uniform and personalized representation, which we call a card. Finally, we introduce a novel search paradigm that leverages the relationships in a card to direct search queries to extract relevant content from multipleWeb sources and fill a new series of cards instead of just returning a list of webpage URLs. Preliminary feedback from users is positive and validates our design",
        "id": 0,
        "year": "2007",
        "$$hashKey": "01I",
        "thumb": "thumbnail/relations.png"
},
{
    "tags": {
        "subject": [
            "Visualization",
            "UI",
            "Search",
            "Web"
        ],
        "publication": [
            "WWW"
        ],
        "year": [
            "2007"
        ],
        "collaborators": [
            "White"
        ]
    },
    "img": "researchImages/websearch.png",
    "caption": "Web Search Variability",
    "primary": "UI-Information",
    "reference": "Investigating Behavioral Variability in Web Search, Ryen W. White and Steven M. Drucker  16th International World Wide Web Conference (WWW 2007), Pages: 21-30 Banff, Canada, May 2007",
    "pdf": "http://research.microsoft.com/en-us/um/people/ryenw/talks/pdf/WhiteDruckerWWW2007.pdf",
    "video": "",
    "pabstract": "Understanding the extent to which people's search behaviors differ in terms of the interaction flow and information targeted is important in designing interfaces to help World Wide Web users search more effectively. In this paper we describe a longitudinal log-based study that investigated variability in people's interaction behavior when engaged in search-related activities on the Web. We analyze the search interactions of more than two thousand volunteer users over a five-month period, with the aim of characterizing differences in their interaction styles. The findings of our study suggest that there are dramatic differences in variability in key aspects of the interaction within and between users, and within and between the search queries they submit. Our findings also suggest two classes of extreme user navigators and explorers whose search interaction is highly consistent or highly variable. Lessons learned from these users can inform the design of tools to support effective Web-search interactions for everyone.",
    "id": 0,
    "year": "2007",
    "$$hashKey": "01H",
    "thumb": "thumbnail/websearch.png"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "UI",
                "Search",
                "Web"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2007"
            ],
            "collaborators": [
                "White",
                "Marchionini",
                "Hearst",
                "schraefel"
            ]
        },
        "img": "researchImages/ExpSearchint.png",
        "caption": "Search Workshop",
        "primary": "UI-Information",
        "reference": "White RW, Drucker SM, Marchionini G, Hearst M, schraefel MC. Exploratory search and HCI: designing and evaluating interfaces to support exploratory search interaction [Internet]. In: CHI '07 extended abstracts on Human factors in computing systems. San Jose, CA, USA: ACM; 2007 [cited 2010 Aug 10]. p. 2877-2880",
        "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/p2877-white.pdf",
        "video": "",
        "pabstract": "The model of search as a turn-taking dialogue between the user and an intermediary has remained unchanged for decades. However, there is growing interest within the search community in evolving this model to support search-driven information exploration activities. So-called exploratory search describes a class of search activities that move beyond fact retrieval toward fostering learning, investigation, and information use. Exploratory search interaction focuses on the user-system communication essential during exploratory search processes. Given this user-centered focus, the CHI conference is an ideal venue to discuss mechanisms to support exploratory searchbehaviors. Specifically, this workshop aims to gather researchers, academics, and practitioners working in human-computer interaction, information retrieval, and other related disciplines, for a discussion of the issues relating to the design and evaluation of interfaces to help users explore, learn, and use information. These are important issues with far-reaching implications for how many computer users accomplish their tasks.",
        "id": 0,
        "year": "2007",
        "$$hashKey": "01G",
        "thumb": "thumbnail/ExpSearchint.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Search"
        ],
        "publication": [
            "ACM"
        ],
        "year": [
            "2006"
        ],
        "collaborators": [
            "White",
            "Kules",
            "schraefel"
        ]
    },
    "img": "researchImages/CACM.png",
    "caption": "Exploratory Search",
    "primary": "UI-Information",
    "reference": "White RW, Kules B, Drucker SM, schraefel M. Introduction. Commun. ACM. 2006;49(4):36-39.",
    "pdf": "http://research.microsoft.com/en-us/um/people/sdrucker/papers/2007introacm.pdf",
    "video": "",
    "pabstract": "",
    "id": 0,
    "year": "2006",
    "$$hashKey": "01D",
    "thumb": "thumbnail/CACM.png"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "UI",
                "Presentation",
                "Temporal"
            ],
            "publication": [
                "UIST"
            ],
            "year": [
                "2006"
            ],
            "collaborators": [
                "Petschnigg",
                "Agrawala"
            ]
        },
        "img": "researchImages/vizpptdiff.jpg",
        "caption": "Powerpoint Diff",
        "primary": "Visualization",
        "reference": "Drucker, S. M., Petschnigg, G., and Agrawala, M. 2006. Comparing and managing multiple versions of slide presentations. In Proceedings of the 19th Annual ACM Symposium on User interface Software and Technology (Montreux, Switzerland, October 15 - 18, 2006). UIST '06. ACM Press, New York, NY, 47-56.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/fp214-DruckerFinalSmall.pdf",
        "video": "http://research.microsoft.com/~sdrucker/Video/pptviznew.wmv",
        "pabstract": "Despite the ubiquity of slide presentations, managing multiple presentations remains a challenge. Understanding how multiple versions of a presentation are related to one another, assembling new presentations from existing presentations, and collaborating to create and edit presentations are difficult tasks. <br>  In this paper, we explore techniques for comparing and managing multiple slide presentations. We propose a general comparison framework for computing similarities and differences between slides. Based on this framework we develop an interactive tool for visually comparing multiple presentations. The interactive visualization facilitates understanding how presentations have evolved over time. We show how the interactive tool can be used to assemble new presentations from a collection of older ones and to merge changes from multiple presentation authors.",
        "id": 0,
        "year": "2006",
        "$$hashKey": "01E",
        "thumb": "thumbnail/vizpptdiff.jpg"
},
{
    "tags": {
        "subject": [
            "Visualization",
            "UI",
            "Web",
            "Search"
        ],
        "publication": [
            "UIST"
        ],
        "year": [
            "2006"
        ],
        "collaborators": [
            "Dontcheva",
            "Salesin",
            "Wade",
            "Cohen"
        ]
    },
    "img": "researchImages/webpage_photo.gif",
    "caption": "Summarizing Web Sessions",
    "primary": "UI-Information",
    "reference": "Dontcheva, M., Drucker, S. M., Wade, G., Salesin, D., and Cohen, M. F. 2006. Summarizing personal web browsing sessions. In Proceedings of the 19th Annual ACM Symposium on User interface Software and Technology (Montreux, Switzerland, October 15 - 18, 2006). UIST '06. ACM Press, New York, NY, 115-124.",
    "video": "http://research.microsoft.com/~sdrucker/Video/uistSummariesfinalCut.mov",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/uistPaperSummarizing.pdf",
    "pabstract": "We describe a system, implemented as a browser extension, that enables users to quickly and easily collect, view, and share personal Web content. Our system employs a novel interaction model, which allows a user to specify webpage extraction patterns by interactively selecting webpage elements and applying these patterns to automatically collect similar content. Further, we present a technique for creating visual summaries of the collected information by combining user labeling with predefined layout templates. These summaries are interactive in nature: depending on the behaviors encoded in their templates, they may respond to mouse events, in addition to providing a visual summary. Finally, the summaries can be saved or sent to others to continue the research at another place or time. Informal evaluation shows that our approach works well for popular websites, and that users can quickly learn this interaction model for collecting content from the Web.",
    "id": 1,
    "year": "2006",
    "$$hashKey": "01F",
    "thumb": "thumbnail/webpage_photo.gif"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "Programming"
            ],
            "publication": [
                "VLL/HCC"
            ],
            "year": [
                "2006"
            ],
            "collaborators": [
                "DeLine",
                "Czerwinski",
                "Meyers",
                "Venolia",
                "Robertson"
            ]
        },
        "img": "researchImages/codethumb.jpg",
        "caption": "Code Thumbnails",
        "primary": "Visualization",
        "reference": "DeLine, R., M. Czerwinski, B. Meyers, G. Venolia, S. Drucker, and G. Robertson.  Code Thumbnails: Using Spatial Memory to Navigate Source Code.  Proc. VL/HCC 2006",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/vlhcc06-final.pdf",
        "pabstract": "Modern development environments provide many features for navigating source code, yet recent studies show the developers still spend a tremendous amount of time just navigating. Since existing navigation features rely heavily on memorizing symbol names, we present a new design, called Code Thumbnails, intended to allow a developer to navigate source code by forming a spa-tial memory of it. To aid intra-file navigation, we add a thumbnail image of the file to the scrollbar, which makes any part of the file one click away. To aid inter-file navigation, we provide a desktop of file thumbnail images, which make any part of any file one click away. We did a formative evaluation of the design with eleven experienced developers and present the results.",
        "id": 2,
        "year": "2006",
        "$$hashKey": "01A",
        "thumb": "thumbnail/codethumb.jpg"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Animation"
        ],
        "publication": [
            "SIGGRAPH"
        ],
        "year": [
            "2006"
        ],
        "collaborators": [
            "Wang",
            "Agrawala",
            "Cohen"
        ]
    },
    "img": "researchImages/aniequation.jpg",
    "caption": "Cartoon Animation Filter",
    "primary": "Graphics",
    "reference": "Jue Wang, Steven Drucker, Maneesh Agrawala, Michael Cohen, The Cartoon Animation Filter, ACM Transactions on Graphics (Proceedings of SIGGRAPH 2006), July 2006",
    "video": "http://research.microsoft.com/~sdrucker/Video/af.mov",
    "pdf": "http://research.microsoft.com/copyright/accept.asp?path=/~sdrucker/papers/TheCartoonAnimationFilter.pdf&pub=ACM",
    "pabstract": "We present the 'Cartoon Animation Filter', a simple filter that takes an arbitrary input motion signal and modulates it in such a way that the output motion is more 'alive' or 'animated'. The filter adds a smoothed, inverted, and (sometimes) time shifted version of the second derivative (the acceleration) of the signal back into the original signal. Almost all parameters of the filter are automated. The user only needs to set the desired strength of the filter. The beauty of the animation filter lies in its simplicity and generality. We apply the filter to motions ranging from hand drawn trajectories, to simple animations within PowerPoint presentations, to motion captured DOF curves, to video segmentation results. Experimental results show that the filtered motion exhibits anticipation, follow-through, exaggeration and squash-and-stretch effects which are not present in the original input motion data.",
    "id": 3,
    "year": "2006",
    "$$hashKey": "01B",
    "thumb": "thumbnail/aniequation.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "Photos"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2006"
            ],
            "collaborators": [
                "Meyers",
                "Brush",
                "Smith",
                "Czerwinski"
            ]
        },
        "img": "researchImages/stepUI27.jpg",
        "caption": "Step User Interfaces",
        "primary": "Photos",
        "reference": "Meyers, B., Brush, A. B., Drucker, S., Smith, M. A., and Czerwinski, M. 2006. Dance your work away: exploring step user interfaces. In CHI '06 Human Factors in Computing Systems (Montréal, Québec, Canada, April 22 - 27, 2006). CHI '06. ACM Press, New York, NY, 387-392.",
        "video": "http://research.microsoft.com/~sdrucker/Video/StepStar.wmv",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/stepUICHI06.pdf",
        "pabstract": "While applications are typically optimized for traditional desktop interfaces using a keyboard and mouse, there are a variety of compelling reasons to consider alternative input mechanisms that require more physical exertion, including promoting fitness, preventing Repetitive Strain Injuries, and encouraging fun. We chose to explore physical interfaces based on foot motion and have built two applications with Step User Interfaces: StepMail and StepPhoto. Both support working with email and photos using the dance pad made popular by the Dance Dance Revolution (DDR) game. Results of a formative evaluation with ten participants suggest that the interactions are intuitive to learn, somewhat enjoyable, and cause participants to increase their level of exertion over sitting at a desk. Our evaluation also revealed design considerations for Step User Interfaces, including balancing effort across the body, avoiding needless exertion, and choosing target applications with care.",
        "id": 4,
        "year": "2006",
        "$$hashKey": "01C",
        "thumb": "thumbnail/stepUI27.jpg"
},
{
    "tags": {
        "subject": [
            "UI",
            "Photos",
            "Visualization"
        ],
        "publication": [
            "SIGCHI"
        ],
        "year": [
            "2005"
        ],
        "collaborators": [
            "Huynh",
            "Baudisch",
            "Wong"
        ]
    },
    "img": "researchImages/tq.png",
    "caption": "TimeQuilt",
    "primary": "Photos",
    "reference": "Huynh, D., Drucker, S., Baudisch, P., Wong, C. Time Quilt: Scaling up Zoomable Photo Browsers for Large, Unstructured Photo Collections. CHI 2005. Portland, OR. Apr. 2005",
    "video": "http://research.microsoft.com/~sdrucker/video/timequilt.wmv",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/CHI2005%20-%20Time%20Quilt%20short.pdf",
    "pabstract": "In the absence of manual organization of large digital photo collections, the photos' visual content and creation dates can help support time-based visual search tasks. Current zoomable photo browsers are designed to support visual searches by maximizing screenspace usage. However, their space-filling layouts fail to convey temporal order effectively. We propose a novel layout called time quilt that trades off screenspace usage for better presentation of temporal order. In an experimental comparison of space-filling, linear timeline, and time quilt layouts, participants carried out the task of finding photos in their personal photo collections averaging 4,000 items. They performed 45% faster on time quilt. Furthermore, while current zoomable photo browsers are designed for visual searches, this support does not scale to thousands of photos: individual thumbnails become less informative as they grow smaller. We found a subjective preference for the use of representative photos to provide an overview for visual searches in place of the diminishing thumbnails.",
    "id": 5,
    "year": "2005",
    "$$hashKey": "018",
    "thumb": "thumbnail/tq.png"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Photos"
            ],
            "publication": [
                "SIGGRAPH"
            ],
            "year": [
                "2004"
            ],
            "collaborators": [
                "Agarwala",
                "Dontcheva",
                "Agrawala",
                "Colburn",
                "Curless",
                "Salesin",
                "Cohen"
            ]
        },
        "img": "researchImages/photomontage.jpg",
        "caption": "Interactive Digital Photomontage",
        "primary": "Photos",
        "reference": "Aseem Agarwala, Mira Dontcheva, Maneesh Agrawala, Steven Drucker, Alex Colburn, Brian Curless, David Salesin, Michael Cohen. Interactive Digital Photomontage. ACM Transactions on Graphics (Proceedings of SIGGRAPH 2004), 2004.",
        "video": "http://grail.cs.washington.edu/projects/photomontage/video.avi",
        "moreinfo": "http://grail.cs.washington.edu/projects/photomontage/",
        "pabstract": "We describe an interactive, computer-assisted framework for combining parts of a set of photographs into a single composite picture, a process we call 'digital photomontage.' Our framework makes use of two techniques primarily: graph-cut optimization, to choose good seams within the constituent images so that they can be combined as seamlessly as possible; and gradient-domain fusion, a process based on Poisson equations, to further reduce any remaining visible artifacts in the composite. Also central to the framework is a suite of interactive tools that allow the user to specify a variety of high-level image objectives, either globally across the image, or locally through a painting-style interface. Image objectives are applied independently at each pixel location and generally involve a function of the pixel values (such as 'maximum contrast') drawn from that same location in the set of source images. Typically, a user applies a series of image objectives iteratively in order to create a finished composite. The power of this framework lies in its generality; we show how it can be used for a wide variety of applications, including 'selective composites' (for instance, group photos in which everyone looks their best), relighting, extended depth of field, panoramic stitching, clean-plate production, stroboscopic visualization of movement, and time-lapse mosaics.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/photomontage.pdf",
        "id": 6,
        "year": "2004",
        "$$hashKey": "016",
        "thumb": "thumbnail/photomontage.jpg"
},
{
    "tags": {
        "subject": [
            "Animation",
            "UI",
            "Presentation"
        ],
        "publication": [
            "DUX"
        ],
        "year": [
            "2005"
        ],
        "collaborators": [
            "Dontcheva",
            "Cohen"
        ]
    },
    "img": "researchImages/v4v.jpg",
    "caption": "V4V",
    "primary": "Presentation",
    "reference": "Dontcheva M., Drucker S., Cohen M., v4v: a View for the Viewer, DUX 2005",
    "video": "http://research.microsoft.com/~sdrucker/Video/v4v.avi",
    "pabstract": "We present a View for the Viewer (v4v), a slide viewer that focuses on the needs of the viewer of a presentation instead of the presenter. Our design centers on representing the deck of slides as a stack embedded in a 3-D world. With only single button clicks, the viewer can quickly and easily navigate the deck of slides. We provide four types of annotation techniques and have designed a synchronization mechanism that makes it easy for the viewer to move in and out of sync with the presenter. We also supply alarms as a method for viewer notification. We evaluate our approach with a preliminary user study resulting in positive feedback about our design plus suggestions for improvements and extensions.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/v4v.pdf",
    "id": 7,
    "year": "2005",
    "$$hashKey": "019",
    "thumb": "thumbnail/v4v.jpg"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Photos",
                "UI",
                "Visualization"
            ],
            "publication": [
                "AVI"
            ],
            "year": [
                "2004"
            ],
            "collaborators": [
                "Wong",
                "Roseway",
                "Glenner",
                "De Mar"
            ]
        },
        "img": "researchImages/MFAG.png",
        "caption": "MediaBrowser",
        "primary": "UI-Information",
        "reference": "Drucker, S. C. Wong, A. Roseway, S. Glenner, S. De Mar, MediaBrowser: Reclaiming the Shoebox. in Proceedings of AVI2004, Gallipoli, Italy, 2004.",
        "video": "http://research.microsoft.com/~sdrucker/Video/LH%20MediaFrame%20Final.wmv",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/mediaframeAVIlong.pdf",
        "moreinfo": "http://research.microsoft.com/~sdrucker/mediaBrowser.htm",
        "pabstract": "Applying personal keywords to images and video clips makes it possible to organize and retrieve them, as well as automatically create thematically related slideshows. MediaBrowser is a system designed to help users create annotations by uniting a careful choice of interface elements, an elegant and pleasing design, smooth motion and animation, and a few simple tools that are predictable and consistent. The result is a friendly, useable tool for turning shoeboxes of old photos into labeled collections that can be easily browsed, shared, and enjoyed.",
        "id": 8,
        "year": "2004",
        "$$hashKey": "015",
        "thumb": "thumbnail/MFAG.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "Photos"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2003"
        ],
        "collaborators": [
            "Wong",
            "Roseway",
            "Glenner",
            "De Mar"
        ]
    },
    "img": "researchImages/phototriage.jpg",
    "caption": "Phototriage",
    "primary": "Photos",
    "reference": "Drucker, S. C. Wong, A. Roseway, S. Glenner, S. De Mar, Photo-triage: Rapidly annotating your digital photographs. MSR Tech Report.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/phototriage.pdf",
    "pabstract": "The Photo-triage application is meant to be an essential part of the digital photography lifestyle. It can fit as a component wherever photo management is done (shell, picture-it, media-center, etc.). The central idea is to facilitate rapid, convenient categorization of one's personal photos into at least the following categories: hidden/private, majority, highlights, best and/or representative. See figure 1. This application is meant to fill an empty niche in the usage of digital photos: that is, there's no easy way add metadata to photos to mark them for printing, for sharing, or for slideshows without creating separate versions of the photos and copying into separate folders. We propose a sorting metaphor that will add implicit metadata when one first goes through the photos. ",
    "id": 9,
    "year": "2003",
    "$$hashKey": "011",
    "thumb": "thumbnail/phototriage.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Movies"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2003"
            ],
            "collaborators": [
                "Roseway",
                "De Mar",
                "Wong"
            ]
        },
        "img": "researchImages/MV_photo.jpg",
        "caption": "Movie Variations",
        "primary": "Media",
        "reference": "Drucker, S. Movie Variations, MS Tech Report",
        "video": "http://research.microsoft.com/~sdrucker/Video/mbrowse2.wmv",
        "pabstract": "This system allows for browsing a movie collection by moving from one related group of movies to another related group, where groups are related by common actor or director. As the user selects a movie from the cluster, it moves to the center and 4 related clusters are moved arranged around the movie. Extensions can include clusters that are related by collaborative filtering or other common features.",
        "id": 10,
        "year": "2003",
        "$$hashKey": "014",
        "thumb": "thumbnail/MV_photo.jpg"
},
{
    "tags": {
        "subject": [
            "UI",
            "Visualization",
            "Information"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2003"
        ],
        "collaborators": [
            "Wong"
        ]
    },
    "caption": "People Browser",
    "primary": "UI-Information",
    "img": "researchImages/peoplebrowser_photo.jpg",
    "reference": "Drucker, S, People Browser, MS Internal Report",
    "video": "http://research.microsoft.com/~sdrucker/Video/peoplebrowser.avi",
    "pabstract": "The concept of 6 degrees separation (6 DOS) can be applied to many different domains. As demonstrated in the MediaVariations Browser, movies can easily be browsed using clusters of related movies using the actor and director to help associate movies. Looking at people is even more natural for this type of browsing, since that is what the concept of 6 DOS is usually associated with. The PeopleBrowser uses a person's rank within an organization, their management chain, their peers (under the same manager), their direct reports, and people with their same title, to help browse through an organization. Other clusters could also easily be used, including those people on the same mailing list, frequently mailed, etc. This project was done in conjunction with the Shell MSX team (Hillel Cooperman, Rob Girling, and Jeni Sadler).",
    "id": 11,
    "year": "2003",
    "$$hashKey": "013",
    "thumb": "thumbnail/peoplebrowser_photo.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "TV",
                "Media"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2002"
            ],
            "collaborators": [
                "Roseway",
                "De Mar",
                "Wong"
            ]
        },
        "img": "researchImages/smartskip_photo.jpg",
        "caption": "Smart Skip",
        "primary": "Media",
        "reference": "Drucker, S.,  Glatzer, A., De Mar, S and Wong, C. SmartSkip: Consumer level browsing and skipping of digital video content. In Proceedings of CHI 2002, Minneapolis, Minnesota, 2002",
        "video": "http://research.microsoft.com/~sdrucker/Video/smartskip2.wmv",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/smartskipfinal.pdf",
        "pabstract": "In this paper, we describe an interface for browsing and skipping digital video content in a consumer setting; that is, sitting and watching television from a couch using a standard remote control. We compare this interface with two other interfaces that are in common use today and found that subjective satisfaction was statistically better with the new interface. Performance metrics however, like time to task completion and number of clicks were worse.",
        "id": 11,
        "year": "2002",
        "$$hashKey": "00Z",
        "thumb": "thumbnail/smartskip_photo.jpg"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "UI",
            "Movies",
            "Visualization"
        ],
        "publication": [
            "DUX"
        ],
        "year": [
            "2005"
        ],
        "collaborators": [
            "Regan",
            "Roseway",
            "Lofstrom"
        ]
    },
    "img": "researchImages/VDM.jpg",
    "caption": "Visual Decision Maker",
    "primary": "Media",
    "reference": "Drucker, S., Regan, T., Roseway, A., Lofstrom. M, The visual decision maker: a recommendation system for collocated users, DUX 2005",
    "video": "http://research.microsoft.com/~sdrucker/Video/vdm.wmv",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/vdmfinal.pdf",
    "pabstract": "We present the Visual Decision Maker (VDM), an application that gives movie recommendations to groups of people sitting together. The VDM provides a TV like user experience: a stream of movie stills flows towards the center of the screen, and users press buttons on remote controls to vote on the currently selected movie. A collaborative filtering engine provides recommendations for each user and for the group as a whole based on the votes. Three principles guided our design of the VDM: shared focus, dynamic pacing, and encouraging conversations. In this paper we present the results of a four month public installation and a lab study showing how these design choices affected people's usage and people's experience of the VDM. Our results show that shared focus is important for users to feel that the group's tastes are represented in the recommendations.",
    "id": 12,
    "year": "2005",
    "$$hashKey": "017",
    "thumb": "thumbnail/VDM.jpg"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "UI",
                "Games"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2003"
            ],
            "collaborators": [
                "He",
                "Cohen",
                "Gupta",
                "Wong",
                "Roseway",
                "De Mar"
            ]
        },
        "img": "researchImages/spectator_photo.jpg",
        "caption": "Spectator (concept)",
        "primary": "Camera",
        "reference": "Drucker, S.M., He. L, Cohen, M., Gupta., A, Wong, C., Spectator Games: A New Entertainment Modality for Networked Multiplayer Games, 2003.",
        "video": "http://research.microsoft.com/~sdrucker/Video/spectator.asf",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/spectator.pdf",
        "pabstract": "Networked multiplayer games are becoming tremendously popular. At any given moment on the Microsoft Game Zone (http://zone.msn.com), there are thousands of people playing Asheron's Call or Age of Empires. Traditional board and card games are also increasingly being played online and will continue to gain in popularity. While networked games are certainly fun for active players, there is potentially a much larger audience: spectators. In most traditional games, such as football, the number of spectators far exceeds the number of players. The key idea presented in this paper is to tap this potential by making online games engaging and entertaining to non-players watching these games. <br> The experience for spectators can be made much richer by employing techniques often used in sports broadcasting, such as a commentator providing analysis and background stories, slow motion and instance replay. For 3D games, cinematic camera movements and shot cuts be much more visually interesting than the first-person views often provided to the players. There is the potential to significantly increase the 'eyeballs' on sites such as Microsoft Game Zone. Spectators can be more easily targeted for advertising. Finally, supporting the spectator experience will help drive sales of the games themselves as casual viewers take the next step to become players. Watching others play networked games has the potential to become a vital component to an overall entertainment/media strategy. The authors of this document have already developed significant technologies needed to support the online game spectator. We propose that new resources be devoted now to carry these technologies into practice.",
        "id": 13,
        "year": "2003",
        "$$hashKey": "010",
        "thumb": "thumbnail/spectator_photo.jpg"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "UI",
            "Games",
            "Thesis"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2003"
        ],
        "collaborators": [
            "He",
            "Cohen",
            "Gupta",
            "Wong",
            "De Mar"
        ]
    },
    "img": "researchImages/spectator3.jpg",
    "caption": "Spectator (MechWarrior)",
    "primary": "Camera",
    "reference": "Drucker, S.M., He. L, Cohen, M., Gupta., A, Wong, C., Spectator Games: A New Entertainment Modality for Networked Multiplayer Games, 2003.",
    "video": "http://research.microsoft.com/~sdrucker/Video/spectator3.wmv",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/spectator.pdf",
    "pabstract": "Networked multiplayer games are becoming tremendously popular. At any given moment on the Microsoft Game Zone (http://zone.msn.com), there are thousands of people playing Asheron's Call or Age of Empires. Traditional board and card games are also increasingly being played online and will continue to gain in popularity. While networked games are certainly fun for active players, there is potentially a much larger audience: spectators. In most traditional games, such as football, the number of spectators far exceeds the number of players. The key idea presented in this paper is to tap this potential by making online games engaging and entertaining to non-players watching these games. <br> The experience for spectators can be made much richer by employing techniques often used in sports broadcasting, such as a commentator providing analysis and background stories, slow motion and instance replay. For 3D games, cinematic camera movements and shot cuts be much more visually interesting than the first-person views often provided to the players. There is the potential to significantly increase the 'eyeballs' on sites such as Microsoft Game Zone. Spectators can be more easily targeted for advertising. Finally, supporting the spectator experience will help drive sales of the games themselves as casual viewers take the next step to become players. Watching others play networked games has the potential to become a vital component to an overall entertainment/media strategy. The authors of this document have already developed significant technologies needed to support the online game spectator. We propose that new resources be devoted now to carry these technologies into practice.",
    "id": 14,
    "year": "2003",
    "$$hashKey": "012",
    "thumb": "thumbnail/spectator3.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "Media",
                "Search",
                "Information"
            ],
            "publication": [
                "Multimedia"
            ],
            "year": [
                "2002"
            ],
            "collaborators": [
                "Gemmell",
                "Bell",
                "Lueder",
                "Wong"
            ]
        },
        "img": "researchImages/memex1.png",
        "caption": "Memex Vision",
        "primary": "UI-Information",
        "video": "",
        "reference": "Gemmell, J., Bell, G., Lueder, R., Drucker, S., & Wong, C. (2002, December). MyLifeBits: fulfilling the Memex vision. In Proceedings of the tenth ACM international conference on Multimedia (pp. 235-238). ACM.",
        "pabstract": "MyLifeBits is a project to fulfill the Memex vision first posited by Vannevar Bush in 1945. It is a system for storing all of one’s digital media, including documents, images, sounds, and videos. It is built on four principles: (1) collections and search must replace hierarchy for organization (2) many visualizations should be supported (3) annotations are critical to non-text media and must be made easy, and (4) authoring should be via transclusion.",
        "id": 15,
        "year": "2002",
        "$$hashKey": "00X",
        "thumb": "thumbnail/memex1.png"
},
{
    "tags": {
        "subject": [
            "UI",
            "TV",
            "Media"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2002"
        ],
        "collaborators": [
            "Wong",
            "Roseway"
        ]
    },
    "img": "researchImages/tvnow_photo.jpg",
    "caption": "Filtered EPG",
    "primary": "Media",
    "video": "http://research.microsoft.com/~sdrucker/nextmedia/TVNow.exe",
    "reference": "Drucker, S.M. 2002, Filtered Electronic Program Guides, MS Technical Report",
    "pabstract": "This electronic program guide uses automatically computed favorites based on viewing habits per time of day and day of week as well as simple filtering features to allow for rapid selection of television.",
    "id": 15,
    "year": "2002",
    "$$hashKey": "00W",
    "thumb": "thumbnail/tvnow_photo.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "TV"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2002"
            ],
            "collaborators": [
                "Wong",
                "Flora"
            ]
        },
        "img": "researchImages/rightnow_viewer_photo.jpg",
        "caption": "Right Now Viewer",
        "primary": "Media",
        "moreinfo": "http://research.microsoft.com/~sdrucker/video/RightNowViewer.exe",
        "reference": "Drucker, S. Wong, C. Right Now Viewer, MS Internal Report",
        "pabstract": "The purpose of this thought experiment was to look at time compression for when you turned on the TV to quickly find out what's on. Changing channels takes time and often there's a commercial on so you have to wait. This demo shows how a tuner could cache 12 most popular tv channels you watch and assemble them into a time compressed 30x real time video clip. In this prototype you can click on an individual thumbnail and it plays regular speed. The time compression inherent in the clips is long enough to transcend the commercials so you can see what's on. UI study participants were able to distinguish different TV formats (like sports vs. news), but failed to get a more detailed grasp of the program. For this the UI seemed to display too much information simultaneously. Additional experiments need to be done to find the right balance of speed, number and size of simultaneous videos playing and video thumbnail size would improve comprehension and recognition.",
        "id": 15,
        "year": "2002",
        "$$hashKey": "00Y",
        "thumb": "thumbnail/rightnow_viewer_photo.jpg"
},
{
    "tags": {
        "subject": [
            "UI",
            "TV",
            "Media"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2001"
        ],
        "collaborators": [
            "Wong"
        ]
    },
    "img": "researchImages/tokenTV_photo.jpg",
    "caption": "Token TV",
    "primary": "Media",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/tokentv.doc",
    "reference": "Drucker, S.M., Wong, C. 2001, Token TV: Sharing preferences for Television DVR Recording, MS Technical Report",
    "moreinfo": "http://research.microsoft.com/~sdrucker/presentations/tokentv.ppt",
    "pabstract": "TV Tokens (GUID for a specific broadcast program or movie) can be embedded in any website, EPG or email, downloaded and shared between friends to send to respective PVR's to schedule recording of show. TokenTV service (dot.NET TV) converts GUID to resolve to local schedule information needed to program the PVR. Any content based website (i.e.: IBDB.com, PBS.org, AFI.org) could have tokens to download to PVR for recording specific content.",
    "id": 16,
    "year": "2001",
    "$$hashKey": "00V",
    "thumb": "thumbnail/tokenTV_photo.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "TV",
                "Media"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2001"
            ],
            "collaborators": [
                "Wong"
            ]
        },
        "img": "researchImages/deepnews_photo.jpg",
        "caption": "DeepNews",
        "primary": "Media",
        "video": "http://research.microsoft.com/~sdrucker/Video/DeepnewsEnhanced.wmv",
        "reference": "Drucker, S.M., Wong, C. 2001, DeepNews: Automatic related material based on closed caption information, MS Technical Report",
        "pabstract": "By monitoring the closed caption stream of a news broadcast, the web can be searched for related articles and more in depth stories can be found.",
        "id": 16,
        "year": "2001",
        "$$hashKey": "00T",
        "thumb": "thumbnail/deepnews_photo.jpg"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Animation"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2000"
        ],
        "collaborators": [
            "Colburn",
            "Cohen"
        ]
    },
    "img": "researchImages/eyegaze.jpg",
    "caption": "Avatar Eye Gaze",
    "primary": "Graphics",
    "reference": "Alex Colburn, Michael F. Cohen, Steven Drucker, The Role of Eye Gaze in Avatar Mediated Conversational Interfaces ,  MSR-TR-2000-81, July, 2000",
    "pdf": "http://research.microsoft.com/research/pubs/view.aspx?type=Technical%20Report&id=391",
    "pabstract": "As we begin to create synthetic characters (avatars) for computer users, it is important to pay attention to both the look and the behavior of the avatar's eyes. In this paper we present behavior models of eye gaze patterns in the context of real-time verbal communication. We apply these eye gaze models to simulate eye movements in a computer-generated avatar in a number of task settings. We also report the results of an experiment that we conducted to assess whether our eye gaze model induces changes in the eye gaze behavior of an individual who is conversing with an avatar.",
    "id": 19,
    "year": "2000",
    "$$hashKey": "00Q",
    "thumb": "thumbnail/eyegaze.jpg"
},
{
        "tags": {
            "subject": [
                "UI",
                "Education",
                "Social"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "2001"
            ],
            "collaborators": [
                "Chesley",
                "Gupta",
                "Kimberly",
                "White"
            ]
        },
        "img": "researchImages/flatland.jpg",
        "caption": "Flatland",
        "primary": "Social",
        "reference": "Chesley, H. Drucker, S. Gupta, A., Kimberly, G. White, S.  Flatland: Rapid prototyping of distributed internet applications.MSR-TR-2001-73.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/flatland.pdf",
        "pabstract": "Computer intra- and internets are widely used for client-server application such as web browsers. With the exception of e-mail, however, the same networks are seldom used for distributed, client-client or client-server-client applications. Such applications are difficult to develop and debug, and require a supporting infrastructure that is not readily available from existing systems. Flatland is a rapid prototyping environment that provides the underlying infrastructure and makes it easy to create and debug distributed internet application prototypes. In addition to the infrastructure needed for a distributed application, Flatland includes safe implementations of the most common sources of distributed application bugs, asynchronous operation and updating. Flatland also supports streaming audio-video and down-level clients.",
        "id": 20,
        "year": "2001",
        "$$hashKey": "00U",
        "thumb": "thumbnail/flatland.jpg"
},
{
    "tags": {
        "subject": [
            "UI",
            "Social"
        ],
        "publication": [
            "UIST"
        ],
        "year": [
            "1999"
        ],
        "collaborators": [
            "Vronay",
            "Smith"
        ]
    },
    "img": "researchImages/streamChat.jpg",
    "caption": "Streaming Chat",
    "primary": "Social",
    "reference": "David Vronay, Marc Smith, and Steven M. Drucker, Chat as a Streaming Media Data Type, UIST. 1999.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/chat.pdf",
    "pabstract": "We describe some common problems experienced by users of computer-based text chat, and show how many of these problems relate to the loss of timing-specific information.  We suggest that thinking of chat as a streaming media data type might solve some of these problems.  We then present a number of alternative chat interfaces along with results from user studies comparing and contrasting them both with each other and with the standard chat interface.",
    "id": 21,
    "year": "1999",
    "$$hashKey": "00N",
    "thumb": "thumbnail/streamChat.jpg"
},
{
        "tags": {
            "subject": [
                "Visualization",
                "Social"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "1999"
            ],
            "collaborators": [
                "Xiong",
                "Smith"
            ]
        },
        "img": "researchImages/collab.jpg",
        "caption": "Collaborative Visualization",
        "primary": "Social",
        "reference": "Rebecca Xiong, Marc A. Smith,Steven M. Drucker, Visualizations of Collaborative Information for End-Users,  Internal Report, 1999.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/collabviz.pdf",
        "pabstract": "There is a growing need for methods and tools to illuminate the social contexts of interaction environments created by the World Wide Web, Usenet newsgroups, email lists, and other network interaction media. We present here a framework for creating visualizations of the social connections created in and through network interaction media. Using graph-drawing methods, visualizations can be created for a range of systems that link people to people and people to objects through networks. As an example, we present an application of our methods to the Usenet to illustrate how visualization can improve existing systems.  We propose that users of network interaction media can benefit from visualizations that illuminate the interaction context generated by the rich interconnections between groups, conversations, and people in these media.",
        "id": 22,
        "year": "1999",
        "$$hashKey": "00O",
        "thumb": "thumbnail/collab.jpg"
},
{
    "tags": {
        "subject": [
            "Social"
        ],
        "publication": [
            "SIGCHI"
        ],
        "year": [
            "2000"
        ],
        "collaborators": [
            "Jensen",
            "Farnham",
            "Kollock"
        ]
    },
    "img": "researchImages/socdilemma.gif",
    "caption": "Social Dilemma Testing",
    "primary": "Social",
    "reference": "Jensen, C., Farnham, S., Drucker, S., & Kollock, P. The Effect of Communication Modality on Cooperation in Online Environments. In Proceedings of CHI 2000, The Hague, Netherlands March 2000.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/chidilemmas.pdf",
    "pabstract": "One of the most robust findings in the sociological literature is the positive effect of communication on cooperation and trust.  When individuals are able to communicate, cooperation increases significantly.  How does the choice of communication modality influence this effect?  We adapt the social dilemma research paradigm to quantitatively analyze different modes of communication. Using this method, we compare four forms of communication: no communication, text-chat, text-to-speech, and voice.  We found statistically significant differences between the various forms of communication, with the voice condition resulting in the highest levels of cooperation.  Our results highlight the importance of striving towards the use of more advanced forms of communication in online environments, especially where trust and cooperation are essential.  In addition, our research demonstrates the applicability of the social dilemma paradigm in testing the extent to which communication modalities promote the development of trust and cooperation. ",
    "id": 23,
    "year": "2000",
    "$$hashKey": "00P",
    "thumb": "thumbnail/socdilemma.gif"
},
{
        "tags": {
            "subject": [
                "Social"
            ],
            "publication": [
                "SIGCHI"
            ],
            "year": [
                "2000"
            ],
            "collaborators": [
                "Smith",
                "Farnham"
            ]
        },
        "img": "researchImages/socialavatar.jpg",
        "caption": "Social Life of Avatars",
        "primary": "Social",
        "reference": "Smith, M., Farnham, S., & Drucker S. The Social Life of Small Graphical Chat Spaces. In Proceedings of CHI 2000, The Hague, Netherlands March 2000.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/chisoclife.pdf",
        "pabstract": "This paper provides a unique quantitative analysis of the social dynamics of three chat rooms in the Microsoft V-Chat graphical chat system. Survey and behavioral data were used to study user experience and activity. 150 V-Chat participants completed a web-based survey, and data logs were collected from three V-Chat rooms over the course of 119 days. This data illustrates the usage patterns of graphical chat systems, and highlights the ways physical proxemics are translated into social interactions in online Environments. V-Chat participants actively used gestures, avatars, and movement as part of their social interactions. Analyses of clustering patterns and movement data show that avatars were used to provide nonverbal cues similar to those found in face-to-face interactions. However, use of some graphical features, in particular gestures, declined as users became more experienced with the system. These findings have implications for the design and study of online interactive environments.",
        "id": 24,
        "year": "2000",
        "$$hashKey": "00S",
        "thumb": "thumbnail/socialavatar.jpg"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Social"
        ],
        "publication": [
            "InternalReport"
        ],
        "year": [
            "2000"
        ],
        "collaborators": [
            "Colburn",
            "Cohen",
            "Counts",
            "Gupta"
        ]
    },
    "img": "researchImages/conferencecalls.jpg",
    "caption": "Graphic enhancement for conference calls",
    "primary": "Social",
    "reference": "Alex Colburn, Michael F. Cohen, Steven Drucker, Scott Lee-Tiernan, Anoop Gupta, Graphical Enhancement For Voice Only Conference Calls,  MSR-TR-2001-95, 2001.",
    "pdf": "http://research.microsoft.com/research/pubs/view.aspx?type=Technical%20Report&id=499",
    "pabstract": "We present two very low bandwidth graphically enhanced interfaces for small group voice communications. One interface presents static images of the participants that highlight when one is speaking. The other interface utilizes three-dimensional avatars that can be quickly created. Eleven groups of 4 or 5 people were presented with each enhanced interface as well as conducting a live conversation and a voice only conversation. Experiments show that both graphically enhanced interfaces improve the understandability of conversations, particular with respect to impressions that others in the group could express themselves more easily, knowing who is talking, and when to speak. Little difference was found between the two graphical interfaces. Analysis of voice tracks also revealed differences between interfaces in the length and number of medium duration silences.",
    "id": 25,
    "year": "2000",
    "$$hashKey": "00R",
    "thumb": "thumbnail/conferencecalls.jpg"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Social"
            ],
            "publication": [
                "InternalReport"
            ],
            "year": [
                "1999"
            ],
            "collaborators": [
                "Individual"
            ]
        },
        "img": "researchImages/uistmoos.jpg",
        "caption": "MOOs to Multi-user apps",
        "primary": "Social",
        "reference": "Steven M. Drucker, Moving from MOOs to Multi-user Applications,  Internal Report, 1999.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/moving.pdf",
        "pabstract": "This paper provides a brief description of the work we have done on the V-Worlds project, a system that facilitates the creation of multi-user applications and environments. We have taken concepts originally found in object oriented Multi-User Dungeons (MOOs) and extended them to deal with more general multi-user and in particular multi-media applications. We present reasons behind the architectural decisions of the platform and show that it has been used successfully for a wide range of examples.",
        "id": 26,
        "year": "1999",
        "$$hashKey": "00M",
        "thumb": "thumbnail/uistmoos.jpg"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Animation",
            "Camera",
            "Thesis"
        ],
        "publication": [
            "Camera"
        ],
        "year": [
            "1994"
        ],
        "collaborators": [
            "Individual"
        ]
    },
    "img": "researchImages/conversesm.gif",
    "caption": "Conversation Agent",
    "primary": "Camera",
    "reference": "Drucker, S.M. Intelligent Camera Control for Graphical Environments PhD Thesis, MIT Media Lab. 1994.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/thesiswbmakrs.pdf",
    "pabstract": "Too often in the field of computer graphics, practitioners have been more concerned with the question of how to move a camera rather than why to move it. This thesis addresses the core question of why the camera is being placed and moved and uses answers to that question to provide a more convenient, more intelligent method for controlling virtual cameras in computer graphics. After discussing the general sorts of activities to be performed in graphical environments, this thesis then contains a derivation of some camera primitives that are required, and examines how they can be incorporated into different interfaces. A single, consistent, underlying framework for camera control across many different domains has been posited and formulated in terms of constrained optimization. Examples from different application domains demonstrate a variety of interface styles that have all been implemented on top of the underlying framework. Evaluations for each application are also given.",
    "id": 18,
    "year": "1994",
    "$$hashKey": "00K",
    "thumb": "thumbnail/conversesm.gif"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "publication": [
                "SIGGRAPH",
                "Thesis"
            ],
            "year": [
                "1995"
            ],
            "collaborators": [
                "Zeltzer"
            ]
        },
        "img": "researchImages/camdroid.gif",
        "caption": "CamDroid",
        "primary": "Camera",
        "reference": "Drucker, S.M. and Zeltzer, D. CamDroid: A System for InEelligent Camera Control. SIGGRAPH Symposium on Interactive 3D Graphics, 1995.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/SIG95symp.pdf",
        "pabstract": "In this paper, a method of encapsulating camera tasks into well defined units called camera modules is described. Through this encapsulation, camera modules can be programmed and sequenced, and thus can be used as the underlying framework for controlling the virtual camera in widely disparate types of graphical environments. Two examples of the camera framework are shown: an agent which can film a conversation between two virtual actors and a visual programming language for filming a virtual football game.",
        "id": 32,
        "year": "1995",
        "$$hashKey": "00L",
        "thumb": "thumbnail/camdroid.gif"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Camera",
            "Thesis"
        ],
        "publication": [
            "Thesis"
        ],
        "year": [
            "1994"
        ],
        "collaborators": [
            "Zeltzer"
        ]
    },
    "img": "researchImages/darpa.gif",
    "caption": "Mission Planner",
    "primary": "Camera",
    "reference": "Zeltzer, D. and Drucker, S.M. A Virtual Environment System for Mission Planning. Proc. 1992 IMAGE VI Conference. Phoenix, AZ. 1992. ",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/mission.pdf",
    "pabstract": "A key function of a mission planning system is to enhance and maintain situational awareness of planning personnel and aircrews who will use the system for pre-mission rehearsals and briefings. We have developed a mission planner using virtual environment technology. We provide a task level interface to computational models of aircraft, terrain, threats and targets, so that users interact directly with these models using voice and gesture recognition, 3D positional input, 3 axis force output, and intelligent camera control.",
    "id": 27,
    "year": "1994",
    "$$hashKey": "00J",
    "thumb": "thumbnail/darpa.gif"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "publication": [
                "GI",
                "Thesis"
            ],
            "year": [
                "1994"
            ],
            "collaborators": [
                "Zeltzer"
            ]
        },
        "img": "researchImages/museum1.gif",
        "caption": "Virtual Museum",
        "primary": "Camera",
        "reference": "Drucker, S.M. and Zeltzer, D. Intelligent Camera Control in a Virtual Environment Graphics Interface '94.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/GImuseum_wfigs.pdf",
        "pabstract": "This paper describes a framework for exploring intelligent camera controls in a 3D virtual environment. It presents a methodology for designing the underlying camera controls based on an analysis of what tasks are to be required in a specific environment. Once an underlying camera framework is built, a variety of interfaces can be connected to the framework. A virtual museum is used as a prototypical virtual environment for this work. This paper identifies some of the tasks that need to be performed in a virtual museum; presents a paradigm for encapsulating those tasks into camera modules; and describes in detail the underlying mechanisms that make up the camera module for navigating through the environment.",
        "id": 28,
        "year": "1994",
        "$$hashKey": "00I",
        "thumb": "thumbnail/museum1.gif"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Camera",
            "Thesis"
        ],
        "publication": [
            "Thesis"
        ],
        "year": [
            "1994"
        ],
        "collaborators": [
            "Individual"
        ]
    },
    "img": "researchImages/footballsm.gif",
    "caption": "Virtual Football",
    "primary": "Camera",
    "reference": "Drucker, S.M. Intelligent Camera Control for Graphical Environments PhD Thesis, MIT Media Lab. 1994.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/thesiswbmakrs.pdf",
    "pabstract": "Too often in the field of computer graphics, practitioners have been more concerned with the question of how to move a camera rather than why to move it. This thesis addresses the core question of why the camera is being placed and moved and uses answers to that question to provide a more convenient, more intelligent method for controlling virtual cameras in computer graphics. After discussing the general sorts of activities to be performed in graphical environments, this thesis then contains a derivation of some camera primitives that are required, and examines how they can be incorporated into different interfaces. A single, consistent, underlying framework for camera control across many different domains has been posited and formulated in terms of constrained optimization. Examples from different application domains demonstrate a variety of interface styles that have all been implemented on top of the underlying framework. Evaluations for each application are also given.",
    "id": 29,
    "year": "1994",
    "$$hashKey": "00H",
    "thumb": "thumbnail/footballsm.gif"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "publication": [
                "SIGGRAPH",
                "Thesis"
            ],
            "year": [
                "1992"
            ],
            "collaborators": [
                "Galyean",
                "Zeltzer"
            ]
        },
        "img": "researchImages/cinema.gif",
        "caption": "Cinema Program",
        "primary": "Camera",
        "reference": "Drucker, S.M., Galyean, T.A., and Zeltzer, D. CINEMA: A System for Procedural Camera Movements. SIGGRAPH Symposium on 3D Interaction. Cambridge, MA. 1992.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/SIG92symp.pdf",
        "pabstract": "This paper presents a general system for camera movement upon which a wide variety of higher-level methods and applications can be built. In addition to the basic commands for camera placement, a key attribute of the CINEMA system is the ability to inquire information directly about the 3D world through which the camera is moving. With this information high-level procedures can be written that closely correspond to more natural camera specifications. Examples of some high-level procedures are presented. In addition, methods for overcoming deficiencies of this procedural approach are proposed.",
        "id": 30,
        "year": "1992",
        "$$hashKey": "00G",
        "thumb": "thumbnail/cinema.gif"
},
{
    "tags": {
        "subject": [
            "Graphics"
        ],
        "publication": [
            "Movie"
        ],
        "year": [
            "1992"
        ],
        "collaborators": [
            "Galyean"
        ]
    },
    "img": "researchImages/sismall.gif",
    "caption": "Self Inflated",
    "primary": "Graphics",
    "reference": "Galyean, T. & Drucker, S.M. Self Inflated Animation, 1992",
    "pabstract": "A video about a republican challenger in 1992. Shown at the Democratic National Convention.",
    "id": 31,
    "year": "1992",
    "$$hashKey": "00F",
    "thumb": "thumbnail/sismall.gif"
},
{
        "tags": {
            "subject": [
                "Graphics",
                "Parallel Computing"
            ],
            "publication": [
                "GI"
            ],
            "year": [
                "1992"
            ],
            "collaborators": [
                "Schroeder"
            ]
        },
        "img": "researchImages/dataparallel.gif",
        "caption": "Parallel Raytracing",
        "primary": "Graphics",
        "reference": "Schroeder, P. and Drucker, S.M. Data Parallel Raytracing. Graphics Interface '92. Vancouver, B.C. 1992.",
        "pdf": "http://research.microsoft.com/~sdrucker/papers/GIraytrace.pdf",
        "pabstract": "We describe a new data parallel algorithm for raytracing. Load balancing is achieved through the use of processor allocation, which continually remaps available resources. In this manner heterogeneous data bases are handled without the usual problems of low resource usage. The proposed approach adapts well to both extremes: a small number of rays and a large database; a large number of rays and a small database. The algorithm scales linearly|over a wide range|in the number of rays and available processors. We present an implementation on the Connection Machine CM2 system and provide timings.",
        "id": 36,
        "year": "1992",
        "$$hashKey": "00E",
        "thumb": "thumbnail/dataparallel.gif"
},
{
    "tags": {
        "subject": [
            "Graphics",
            "Parallel Computing"
        ],
        "publication": [
            "PhotorealisticWorkshop"
        ],
        "year": [
            "1992"
        ],
        "collaborators": [
            "Schroeder"
        ]
    },
    "img": "researchImages/parallelRadiosity.gif",
    "caption": "Parallel Radiosity",
    "primary": "Graphics",
    "reference": "Drucker, S.M. and Schroeder, P. Fast Radiosity:A Data Parallel Approach. 3rd Workshop on Photorealistic Rendering, Bristol, U.K. 1992.",
    "pdf": "http://research.microsoft.com/~sdrucker/papers/eurorendworkshop.pdf",
    "pabstract": "We present a data parallel algorithm for radiosity. The algorithm was designed to take advantage of large numbers of processors. It has been implemented on the Connection Machine CM2 system and scales linearly in the number of available processors over a wide range. All parts of the algorithm | form-factor computation, visibility determination, adaptive subdivision, and linear algebra solution | execute in parallel with a completely distributed database. Load balancing is achieved through processor allocation and dynamic data structures which reconfigure appropriately to match the granularity of the required calculations.",
    "id": 37,
    "year": "1992",
    "$$hashKey": "00D",
    "thumb": "thumbnail/parallelRadiosity.gif"
},
{
        "tags": {
            "subject": [
                "Robotics",
                "Learning",
                "Thesis"
            ],
            "publication": [
                "IEEE",
                "MastersThesis"
            ],
            "year": [
                "1989"
            ],
            "collaborators": [
                "Aboaf",
                "Atkeson"
            ]
        },
        "img": "researchImages/robotlearn.gif",
        "caption": "Task Level Learning",
        "primary": "Robotics",
        "reference": "Aboaf, E, Drucker, S.M, and Atkeson, C.G. Task Level Learning on a Juggling Task. IEEE Robotics Conference. Scottsdale, AZ. 1989.",
        "pdf": "http://research.microsoft.com/copyright/accept.asp?path=/~sdrucker/papers/tasklevel.pdf&pub=IEEE",
        "pabstract": "We report on a preliminary investigation of task-level learning, an approach to learning from practice. We have a programmaed a robot to juggle a single ball in three dimensions by batting it upwards with a large paddle. The robot uses a real-time binary vision system to track the ball and measure its performance. Task-level learning consists of building a model of performance errors at the task level during practice, and using that model to refine task-level commands. A polynomial surface was fit to the errors in where the ball went after each hit, and this task model is used to refine how the ball is hit. This application of task-level learning dramatically increased the number of consecutive hits the robot could execute before the ball was hit out of range of the paddle.",
        "id": 33,
        "year": "1989",
        "$$hashKey": "00C",
        "thumb": "thumbnail/robotlearn.gif"
},
{
    "tags": {
        "subject": [
            "Robotics",
            "Touch"
        ],
        "publication": [
            "Book"
        ],
        "year": [
            "1988"
        ],
        "collaborators": []
    },
    "img": "researchImages/natcomp.png",
    "caption": "Texture from Touch",
    "primary": "Robotics",
    "reference": "Steven M. Drucker. Texture from Touch. In: Whitman Richards, editor. Natural Computation. MIT Press; 1988. ",
    "pdf": "",
    "pabstract": "Not available",
    "id": 33,
    "year": "1988",
    "$$hashKey": "00A",
    "thumb": "thumbnail/natcomp.png"
},
{
        "tags": {
            "subject": [
                "Robotics",
                "Touch"
            ],
            "publication": [
                "IEEE"
            ],
            "year": [
                "1987"
            ],
            "collaborators": [
                "Siegel",
                "Garabieta"
            ]
        },
        "img": "researchImages/perfanalysis.png",
        "caption": "Tactile Sensor",
        "primary": "Robotics",
        "reference": "Siegel, D.; Drucker, S.; Garabieta, I, Performance analysis of a tactile sensor, Robotics and Automation. Proceedings. 1987 IEEE International Conference on , vol.4, no., pp.1493,1499, March 1987",
        "pdf": "http://research.microsoft.com/copyright/accept.asp?path=/~sdrucker/papers/tactilesensor,pdf&pub=IEEE",
        "pabstract": "This paper discusses the design of a contact sensor for use with the Utah-MIT dexterous hand [Jacobsen, et al. 1984]. The sensor utilizes an 8x8 array of capacitive cells. This paper extends the work presented in Siegel and Garabiet [1986], and the ealier work of Boie [1984]; a more detailed design analysis, modifications to the construction process, and better performance results are shown.",
        "id": 33,
        "year": "1987",
        "$$hashKey": "008",
        "thumb": "thumbnail/perfanalysis.png"
},
{
    "tags": {
        "subject": [
            "Hyptertext",
            "UI",
            "Information"
        ],
        "publication": [
            "IEEE"
        ],
        "year": [
            "1988"
        ],
        "collaborators": [
            "Yankelovich",
            "Haan",
            "Meyrowitz"
        ]
    },
    "img": "researchImages/intermedia.gif",
    "caption": "Intermedia1",
    "primary": "Hypertext",
    "reference": "Yankelovich, N, Haan, B.J., Meyrowitz, N. and Drucker, S.M., INTERMEDIA: The Concept and Construction of a Seamless Environment. IEEE Computer, January: 1988.",
    "pdf": "http://research.microsoft.com/copyright/accept.asp?path=/~sdrucker/papers/intermedia1.pdf&pub=IEEE",
    "pabstract": "none",
    "id": 34,
    "year": "1988",
    "$$hashKey": "00B",
    "thumb": "thumbnail/intermedia.gif"
},
{
        "tags": {
            "subject": [
                "Hyptertext",
                "UI",
                "Information"
            ],
            "publication": [
                "ICSS"
            ],
            "year": [
                "1988"
            ],
            "collaborators": [
                "Yankelovich",
                "Haan"
            ]
        },
        "img": "researchImages/intermedia2.gif",
        "caption": "Intermedia2",
        "primary": "Hypertext",
        "reference": "Yankelovich, N, Haan, B.J., and Drucker, S.M., Connections in Context: the Intermedia Systems. International Conference on Systems Sciences, Vol. 2 pp. 715-724, January: 1988.",
        "pdf": "http://research.microsoft.com/copyright/accept.asp?path=/~sdrucker/papers/connintermedia.pdf&pub=IEEE",
        "pabstract": "none",
        "id": 35,
        "year": "1988",
        "$$hashKey": "009",
        "thumb": "thumbnail/intermedia2.gif"
}
]
}
